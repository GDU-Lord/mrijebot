import TelegramBot from "node-telegram-bot-api";
import { procedure } from "../core/chain";
import { CHAIN } from "../core/actions";
import { $info } from "./info";
import { $email } from "./form/register/index";
import { createButtons, keyboard } from "../custom/hooks/buttons";
import { addCrum } from "../custom/hooks/menu";
import { editLast } from "../custom/hooks/messageOptions";
import { routeCallback } from "../custom/hooks/routes";
import { initState, StateType } from "../custom/hooks/state";
import { Bot } from "../core/index";
import { $main } from "./profile/index";
import * as api from "../api";
import { CONTROL, MENU } from "./mapping";
import { getAllRoles } from "../api/role";
import { optionsField } from "./presets/options";
import "dotenv/config";
import { backOption } from "./back";
import { loadUser } from "./loaduser";

export const startButtons = createButtons<StateType>(async state => {
  const buttons: keyboard = [
    [["ℹ️ Інформація", MENU.option[0]]]
  ];
  if(!state.data.storage.user) buttons.push([["👤Реєстрація", MENU.option[1]]]);
  else if(state.data.storage.user.isVerified) {
    buttons.push(
      [["👤Мій профіль", MENU.option[2]]],
      [["📢Оголошення", `https://t.me/${process.env.ANNOUNCER_TAG}`]]
    );
  }
  else buttons.push([["📢Активувати оголошення", MENU.option[3]]]);
  return buttons;
});

routeCallback(startButtons, MENU.option[0], $info);
routeCallback(startButtons, MENU.option[1], $email.proc);
routeCallback(startButtons, MENU.option[2], $main.proc);

export const $start = procedure();
$start.make()
  .func(async state => {
    const lastInput = state.lastInput;
    const message = (lastInput as TelegramBot.CallbackQuery).message ?? (lastInput as TelegramBot.Message);
    if(state.data == null && message.chat.type !== "private")
      return CHAIN.NEXT_LISTENER;
    return CHAIN.NEXT_ACTION;
  })
  .func(initState())
  .func(addCrum($start))
  .func<StateType>(loadUser)
  .send<StateType>(async state => {
    let mention = "Тебе";
    let options = [
      "⭐️Отримати корисну інформацію",
      "⭐️Зв'язатися з організаторами",
    ];
    if(state.data.storage.user) {
      const chatMember = await Bot.getChatMember(state.core.chatId, +state.data.storage.user.telegramId);
      mention = `<a href="tg://user?id={data.storage.user.telegramId}">@${chatMember.user.username ?? chatMember.user.first_name}</a>, тебе`;
      options.push("⭐️Змінити свої дані");
    }
    else {
      options.push("⭐️Подати заявку на вступ");
    }
    return `<b><u>Головне меню</u></b>\n\n${mention} вітає українська ініціатива настільних рольових ігор у Німеччині "Мрієтворці | The DreamForgers"!\n\n<b>Через нашого телеграм бота ти можеш:</b>\n\n${options.join("\n")}`;
  }, startButtons.get, editLast());

export const $turnOnAnnouncements = optionsField<StateType>(
  async state => {
    return `<b><u>📢Активація оголошень</u></b>\n\nЩоб отримувати оголошення про події та системні сповіщення, почни чат із нашим Оголошень:\n\n👉 <a href="https://t.me/${process.env.ANNOUNCER_TAG!}?start=verify">ПІДКЛЮЧИТИ</a>`;
  },
  [
    [["✅ ГОТОВО!", CONTROL.back]]
  ]
);

backOption($turnOnAnnouncements.btn);
routeCallback(startButtons, MENU.option[3], $turnOnAnnouncements.proc);

  // OLD CODE for GoogleAPI:
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