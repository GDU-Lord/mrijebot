import TelegramBot from "node-telegram-bot-api";
import { Action, CHAIN, UserInput } from "./actions.js";
import { inputType } from "./chain.js";
import { Bot, procedureListener } from "./index.js";
import { LocalState, UserState } from "./state.js";
import getId from "./id.js";

export class On {
  actions: Action<On | UserInput>[] = [];
  constructor(
    public filter: (...args: any) => boolean
  ) {}
}

export class OnBot extends On {
  constructor(
    public type: keyof TelegramBot.TelegramEvents,
    public filter: (...args: any) => boolean
  ) {
    super(filter);
    Bot.addListener(type, async (inp: inputType) => {
      if(!filter(inp)) return;
      if(inp.from == null) return;
      let userState = UserState.list[inp.from.id];
      let localState: LocalState | null = null;
      let chatId: TelegramBot.ChatId;
      let threadId: number | undefined;
      if(userState == null)
        userState = new UserState(inp.from.id);
      if(type === "message") {
        chatId = (inp as TelegramBot.Message).chat.id;
        threadId = (inp as TelegramBot.Message).message_thread_id;
        localState = userState.localStates[chatId];
        if(localState == null)
          localState = new LocalState(chatId, inp.from.id);
        localState.lastInput = inp;
      }
      // add additional data to queries (for chat id and thread)
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