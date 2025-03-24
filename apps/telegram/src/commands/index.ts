import TelegramBot from "node-telegram-bot-api";
import { on } from "../core/chain";
import { Bot, initPromise } from "../core/index";
import { ping } from "./ping";
import { $start } from "./start";
import { command } from "../custom/hooks/filters";
import { call } from "../custom/hooks/menu";
import { afterInit } from "../afterInit";
import { initDefault } from "./default";
import { $createLand, $wizard } from "./wizard/login";

afterInit.push(initDefault);

export async function initCommands() {

  await initPromise;
  
  ping();

  on("message", command("/start")).func(call($start));
  on("message", command("/admin")).func(call($wizard));
  on("message", command("/createland")).func(call($createLand));
  on("message", () => true).func(async state => {
    const msg = state.lastInput as TelegramBot.Message;
    setTimeout(async () => {
      try {
        await Bot.deleteMessage(msg.chat.id, msg.message_id);
      } catch {}
    }, 2000);
  });

}