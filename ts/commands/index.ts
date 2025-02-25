import TelegramBot from "node-telegram-bot-api";
import { on } from "../core/chain.js";
import { Bot, initPromise } from "../core/index.js";
import { buttonCallbackValue, call, command } from "../custom/hooks.js";
import { $info } from "./info.js";
import { ping } from "./ping.js";
import { $start, startButtons } from "./start.js";

export async function initCommands() {

  await initPromise;
  
  ping();

  on("message", command("/start")).func(call($start));
  on("message", () => true).func(async state => {
    const msg = state.lastInput as TelegramBot.Message;
    setTimeout(async () => {
      try {
        await Bot.deleteMessage(msg.chat.id, msg.message_id);
      } catch {}
    }, 2000);
  });

}