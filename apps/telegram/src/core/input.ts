import TelegramBot from "node-telegram-bot-api";
import { Bot } from "./index";
import { LocalState } from "./state";

export class InputListener {

  promises: [LocalState<any, any>, (msg: TelegramBot.Message | null) => void][] = [];

  constructor() {
    Bot.addListener('message', (msg) => {
      for(const i in this.promises) {
        const [state, resolve] = this.promises[i];
        if(state.core.chatId !== msg.chat.id || state.core.userId !== msg.from?.id) continue;
        resolve(msg);
        this.promises.splice(+i, 1);
      }
    });
  }

  getInput(state: LocalState<any, any>) {
    return new Promise<TelegramBot.Message | null>((resolve) => {
      this.promises.push([state, resolve]);
    });
  }

}