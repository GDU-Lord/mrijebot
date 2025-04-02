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

export class Action<Parent extends On | UserInput> {

  constructor(
    public parent: Parent,
    public callback: (parent: Parent, state: LocalState) => Promise<CHAIN>
  ) {}

}

export class Send<LocalData = any, UserData = any> extends Action<On | UserInput> {
  constructor(text: string | ((state: LocalState<LocalData, UserData>) => Promise<string | [string, CHAIN]>), options: SendMessageOptions | EditMessageTextOptions | optionsGenerator, parent: On | UserInput, message_id: ((state: LocalState<LocalData, UserData>) => Promise<number>) | number | null = null) {
    super(parent, async (p, state) => {
      let rawText: string;
      let chain: CHAIN = CHAIN.NEXT_ACTION;
      if(typeof text === "function") {
        try {
          const rawTextRes = await text(state);
          if(typeof rawTextRes === "string")
            rawText = rawTextRes;
          else {
            rawText = rawTextRes[0];
            chain = rawTextRes[1] ?? chain;
          }
        } catch (err) {
          console.log(err);
          return CHAIN.NEXT_LISTENER;
        }
      }
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
          return chain;
        } catch {}
      }
      state.lastMessageSent = await Bot.sendMessage(state.core.chatId, stateText, {
        message_thread_id: state.core.threadId,
        ..._options
      });
      return chain;
    });
  }
}

export class Func<LocalData = any, UserData = any> extends Action<On | UserInput> {
  constructor(callback: (state: LocalState<LocalData, UserData>) => Promise<CHAIN | void>, parent: On | UserInput) {
    super(parent, async (p, state) => {
      try {
        return await callback(state) ?? CHAIN.NEXT_ACTION;
      } catch (err) {
        console.log(err);
        return CHAIN.NEXT_LISTENER;
      }
    });
  }
}

export class UserInput extends Action<On | UserInput> {
  actions: Action<On | UserInput>[] = [];
  constructor(key: string, remove: boolean, parent: On | UserInput) {
    super(parent, async (p, state) => {
      const res = await inputListener.getInput(state);
      try {
        if(remove) await Bot.deleteMessage(state.core.chatId, res?.message_id ?? -1);
      } catch {}
      if(res == null) {
        return CHAIN.NEXT_LISTENER;
      }
      state.core.inputs[key] = res;
      for(const action of this.actions) {
        try {
          const actionRes = await action.callback(this, state);
          if(actionRes !== CHAIN.NEXT_ACTION) break;
        } catch (err) {
          console.log(err);
          break;
        }
      }
      return CHAIN.NEXT_ACTION;
    });
    parent.actions.push(this);
  }
}

export type optionsGenerator = (localState: LocalState | null) => Promise<SendMessageOptions>;