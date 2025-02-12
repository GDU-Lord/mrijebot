import TelegramBot from "node-telegram-bot-api";
import { procedure } from "../core/chain.js";
import { CHAIN } from "../core/actions.js";
import { $info } from "./info.js";
import { $email } from "./form/register/index.js";
import { createButtons } from "../custom/hooks/buttons.js";
import { addCrum } from "../custom/hooks/menu.js";
import { editLast } from "../custom/hooks/messageOptions.js";
import { routeCallback } from "../custom/hooks/routes.js";
import { initState } from "../custom/hooks/state.js";

export const startButtons = createButtons([
  [["ℹ️ Інформація", 1]],
  [["👤Реєстрація", 2]],
]);

routeCallback(startButtons, 1, $info);
routeCallback(startButtons, 2, $email);

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
    // const username = state.lastInput.from?.username;
    // const userId = state.core.userId;
    // // get user data from the table
    // const [data, index] = getUserData(String(userId), username ?? "");
    // if(index > -1) {
    //   if(data[3] !== String(userId)) {
    //     data[3] = String(userId); // replace username with userId
    //     await setUserData(data, index);
    //   }
    //   state.data.user = data;
    //   state.data.userIndex = index;
    // }
  })
  .send(async state => {
    let mention = "Тебе";
    if(state.data.user) {
      mention = "{data.user.2}, тебе";
    }
    return `<b><u>Головне меню</u></b>\n\n${mention} вітає українська ініціатива настільних рольових ігор у Німеччині "Мрієтворці | The DreamForgers"!\n\n<b>Через нашого телеграм бота ти можеш:</b>\n\n⭐️Подати заявку на вступ\n⭐️Отримати корисну інформацію\n⭐️Зв'язатися з організаторами`;
  }, startButtons.get, editLast());