import TelegramBot from "node-telegram-bot-api";
import { on, procedure } from "../core/chain.js";
import { CHAIN } from "../core/actions.js";
import { addCrum, buttonCallbackValue, call, createButtons, initState, routeCallback } from "../custom/hooks.js";
import { backOption } from "./back.js";
import { $info } from "./info.js";
import { $register } from "./register.js";
import { Bot, initPromise } from "../core/index.js";

export const startButtons = createButtons([
  [["Інформація", 1]],
  [["Реєстрація", 2]],
]);

routeCallback(startButtons, 1, $info);
routeCallback(startButtons, 2, $register);

export const $start = procedure();
$start.make()
  .func(async state => {
    if(state.data == null && (state.lastInput as TelegramBot.Message).chat.type !== "private")
      return CHAIN.NEXT_LISTENER;
    return CHAIN.NEXT_ACTION;
  })
  .func(initState())
  .func(addCrum($start))
  .func(async state => {
    try {
      Bot.deleteMessage(state.core.chatId, state.lastMessageSent.message_id);
    } catch {}
  })
  .send(`Вас вітає українська ініціатива Настільних Рольових Ігор в Німеччині "Мрієтворці | The DreamForgers"!\n\nОбери одну з наступних опцій:`, startButtons.get);