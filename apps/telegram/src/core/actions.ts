import TelegramBot, { EditMessageTextOptions, SendMessageOptions, User } from "node-telegram-bot-api";
import { On } from "./on";
import { LocalState, UserState } from "./state";
import { Bot, inputListener } from "./index";
import { insertText } from "./insert";
import { inputType } from "./chain";

export enum CHAIN {
  NEXT_ACTION = 0,
  NEXT_LISTENER = 1,
  EXIT = 2,
}

export class Action<Parent extends On | Check | CheckNest | UserInput | UserInputCase> {

  constructor(
    public parent: Parent,
    public callback: (parent: Parent, state: LocalState) => Promise<CHAIN>
  ) {}

}

export class Send<LocalData = any, UserData = any> extends Action<On | UserInput> {
  constructor(text: string | ((state: LocalState<LocalData, UserData>) => Promise<string>), options: SendMessageOptions | EditMessageTextOptions | optionsGenerator, parent: On | UserInput, message_id: ((state: LocalState<LocalData, UserData>) => Promise<number>) | number | null = null) {
    super(parent, async (p, state) => {
      let rawText: string;
      if(typeof text === "function")
        rawText = await text(state);
      else
        rawText = text;
      const stateText = insertText(state, rawText);
      let _options = typeof options === "function" ? await options(state) : options;
      if(message_id) {
        try {
          await Bot.editMessageText(stateText, {
            chat_id: state.core.chatId,
            message_id: +(typeof message_id === "function" ? await message_id(state) : message_id),
            ...(_options as EditMessageTextOptions)
          });
          return CHAIN.NEXT_ACTION;
        } catch {}
      }
      state.lastMessageSent = await Bot.sendMessage(state.core.chatId, stateText, {
        message_thread_id: state.core.threadId,
        ..._options
      });
      return CHAIN.NEXT_ACTION;
    });
  }
}

export class Func<LocalData = any, UserData = any> extends Action<On | UserInput> {
  constructor(callback: (state: LocalState<LocalData, UserData>) => Promise<CHAIN | void>, parent: On | UserInput) {
    super(parent, async (p, state) => {
      let res = await callback(state) ?? CHAIN.NEXT_ACTION;
      return res;
    });
  }
}

export class UserInput extends Action<On | UserInput> {
  actions: Action<On | UserInput>[] = [];
  constructor(key: string, parent: On | UserInput) {
    super(parent, async (p, state) => {
      const res = await inputListener.getInput(state);
      if(res == null) {
        return CHAIN.NEXT_LISTENER;
      }
      state.core.inputs[key] = res;
      for(const action of this.actions) {
        const actionRes = await action.callback(this, state);
        if(actionRes !== CHAIN.NEXT_ACTION) break;
      }
      return CHAIN.NEXT_ACTION;
    });
    parent.actions.push(this);
  }
}

export class ActionCase extends Action<Check | CheckNest | UserInputCase> {
  
}

export class Check<resType= any, LocalData = any, UserData = any> extends Action<On | UserInput> {
  cases: [resType, ActionCase][] = [];
  constructor(callback: (state: LocalState<LocalData, UserData>) => Promise<resType>, parent: On | UserInput) {
    super(parent, async (p, state) => {
      const res: resType = await callback(state);
      for(const [value, action] of this.cases) {
        if(value === res) {
          const actionRes = await action.callback(this, state);
          if(actionRes !== CHAIN.NEXT_ACTION) break;
        }
      }
      return CHAIN.NEXT_ACTION;
    });
    parent.actions.push(this);
  }
}

export class SendCase<LocalData = any, UserData = any> extends ActionCase {
  constructor(parent: Check, match: (typeof parent)['cases'][0][0], text: string | ((state: LocalState<LocalData, UserData>) => Promise<string>), options: SendMessageOptions | optionsGenerator) {
    super(parent, async (p, state) => {
      let rawText: string;
      if(typeof text === "function")
        rawText = await text(state);
      else
        rawText = text;
      const stateText = insertText(state, rawText);
      let _options = typeof options === "function" ? await options(state) : options;
      state.lastMessageSent = await Bot.sendMessage(state.core.chatId, stateText, {
        message_thread_id: state.core.threadId,
        ..._options
      });
      return CHAIN.NEXT_ACTION;
    });
    parent.cases.push([match, this]);
  }
}

export class FuncCase<LocalData = any, UserData = any> extends ActionCase {
  constructor(parent: Check, match: (typeof parent)['cases'][0][0], callback: (state: LocalState<LocalData, UserData>) => Promise<CHAIN | void>) {
    super(parent, async (p, state) => {
      let res = await callback(state) ?? CHAIN.NEXT_ACTION;
      return res;
    });
    parent.cases.push([match, this]);
  }
}

export class CheckNest<resType= any, LocalData = any, UserData = any> extends ActionCase {
  cases: [resType, ActionCase][] = [];
  constructor(parent: Check, match: (typeof parent)['cases'][0][0], callback: (state: LocalState<LocalData, UserData>) => Promise<resType>) {
    super(parent, async (p, state) => {
      const res: resType = await callback(state);
      for(const [value, action] of this.cases) {
        if(value === res) {
          const actionRes = await action.callback(this, state);
          if(actionRes !== CHAIN.NEXT_ACTION) break;
        }
      }
      return CHAIN.NEXT_ACTION;
    });
    parent.cases.push([match, this]);
  }
}

export class UserInputCase extends ActionCase {
  actions: ActionCase[] = [];
  constructor(parent: Check | CheckNest, key: string, match?: (typeof parent)['cases'][0][0]) {
    super(parent, async (p, state) => {
      const res = await inputListener.getInput(state);
      if(res == null) {
        return CHAIN.NEXT_LISTENER;
      }
      state.core.inputs[key] = res;
      for(const action of this.actions) {
        const actionRes = await action.callback(this, state);
        if(actionRes !== CHAIN.NEXT_ACTION) break;
      }
      return CHAIN.NEXT_ACTION;
    });
    if(parent instanceof UserInputCase)
      parent.actions.push(this);
    else
      parent.cases.push([match, this]);
  }
}

export type optionsGenerator = (localState: LocalState | null) => Promise<SendMessageOptions>;