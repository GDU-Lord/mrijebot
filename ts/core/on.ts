import TelegramBot from "node-telegram-bot-api";
import { Action, CHAIN, UserInput } from "./actions.js";
import { inputType } from "./chain.js";
import { Bot, procedureListener } from "./index.js";
import { LocalState, UserState } from "./state.js";
import getId from "./id.js";
import { availableEventTypes, getState } from "../custom/listeners.js";

export class On {
  actions: Action<On | UserInput>[] = [];
  constructor(
    public filter: (...args: any) => boolean
  ) {}
}

export class OnBot extends On {
  constructor(
    public type: availableEventTypes,
    public filter: (...args: any) => boolean
  ) {
    super(filter);
    Bot.addListener(type, async (inp: inputType) => {
      if(!filter(inp)) return;
      const [userState, localState] = getState(type, inp);
      if(localState != null) localState.lastInput = inp;
      for(const action of this.actions) {
        const res = await action.callback(action.parent, localState!);
        if(res !== CHAIN.NEXT_ACTION) break;
      }
    });
  }
}

export class Procedure extends On {
  actions: Action<On | UserInput>[] = [];
  constructor(
    public name: string,
    public filter: (text: string) => boolean
  ) {
    super(filter);
    procedureListener.add(name, filter, async (text: string, state: LocalState, index?: number) => {
      return new Promise<any>(async resolve => {
        if(!(name in state.core.procedures))
          state.core.procedures[name] = [];
        state.core.procedures[name][index ?? state.core.procedures[name].length] = {
          resolve,
          cache: {
            index: index ?? null
          }
        };
        for(const action of this.actions) {
          const res = await action.callback(action.parent, state);
          if(res !== CHAIN.NEXT_ACTION) break;
        }
      });
    });
  }
}

export class ProcedureListener {

  listeners: [string, (text: string) => boolean, (text: string, state: LocalState, index?: number) => Promise<any>][] = [];

  call = <T = any>(name: string, state: LocalState, index?: number): Promise<T> | undefined => {
    for(const listener of this.listeners)
      if(listener[1](name)) return listener[2](name, state, index);
  }

  add(name: string, filter: (text: string) => boolean, callback: (text: string, state: LocalState, index?: number) => Promise<any>) {
    this.listeners.push([name, filter, callback]);
  }

}