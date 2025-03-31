import { CallbackQuery } from "node-telegram-bot-api";
import { on, procedure } from "../core/chain";
import { $start } from "./start";
import { Bot } from "../core";
import { call } from "../custom/hooks/menu";

export const $setup = procedure();
$setup.make()
  .func(async (state) => {
    try {
      await Bot.deleteMessage(state.core.chatId, state.lastMessageSent.message_id);
    } catch {}
  })
  .send("Заважтаження...", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "RESTART",
            callback_data: "RESTART"
          }
        ]
      ]
    }
  })
  // .func(async state => console.log(state.lastMessageSent))
  .func(call($start));

export async function initDefault() {

  on("callback_query", () => true)
    .func(async state => {
      if(state.lastMessageSent != null) return;
      state.lastMessageSent = (state.lastInput as CallbackQuery).message!;
      state.call($start);
    });
  
  on("callback_query", (inp: CallbackQuery) => inp.data === "RESTART")
    .func(call($setup));

}