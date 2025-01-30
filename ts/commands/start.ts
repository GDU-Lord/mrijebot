import TelegramBot from "node-telegram-bot-api";
import { on, procedure } from "../core/chain.js";
import { CHAIN } from "../core/actions.js";
import { addCrum, buttonCallbackValue, call, createButtons, initState, routeCallback } from "../custom/hooks.js";
import { backOption } from "./back.js";
import { $info } from "./info.js";
import { $register } from "./register.js";
import { Bot, initPromise } from "../core/index.js";
import { getUserData, setUserData } from "../api/api.js";
import { afterStartInit } from "./form.js";

export const startButtons = createButtons([
  [["ℹ️ Інформація", 1]],
  [["👤Реєстрація", 2]],
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
  .func(initState(true))
  .func(addCrum($start))
  .func(async state => {
    const username = state.lastInput.from?.username;
    const userId = state.core.userId;
    // get user data from the table
    const [data, index] = getUserData(String(userId), username ?? "");
    if(index > -1) {
      if(data[3] !== String(userId)) {
        data[3] = String(userId); // replace username with userId
        await setUserData(data, index);
      }
      state.data.user = data;
      state.data.userIndex = index;
    }
  })
  .func(async state => {
    try {
      Bot.deleteMessage(state.core.chatId, state.lastMessageSent.message_id);
    } catch {}
  })
  .send(async state => {
    let mention = "Тебе";
    if(state.data.user) {
      mention = "{data.user.2}, тебе";
    }
    return `<b><u>Головне меню</u></b>\n\n${mention} вітає українська ініціатива настільних рольових ігор у Німеччині "Мрієтворці | The DreamForgers"!\n\n<b>Через нашого телеграм бота ти можеш:</b>\n\n⭐️Подати заявку на вступ\n⭐️Отримати корисну інформацію\n⭐️Зв'язатися з організаторами`;
  }, startButtons.get);

afterStartInit();