import { CallbackQuery } from "node-telegram-bot-api";
import { on } from "../core/chain.js";
import { $start } from "./start.js";

export async function initDefault() {

  on("callback_query", () => true)
    .func(async state => {
      if(state.lastMessageSent != null) return;
      state.lastMessageSent = (state.lastInput as CallbackQuery).message!;
      state.call($start);
    });

}