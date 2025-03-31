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
import { User } from "../app/entities/user.entity";
import { Member } from "../app/entities/member.entity";
import { Land } from "../app/entities/land.entity";
import { Bot } from "../core/index";
import { $main } from "./profile/index";
import * as api from "../api";
import { CONTROL, MENU } from "./mapping";

export const startButtons = createButtons<StateType>(async state => {
  const buttons: keyboard = [
    [["ℹ️ Інформація", MENU.option[0]]]
  ];
  if(state.data.storage.user) buttons.push([["👤Мій профіль", MENU.option[2]]]);
  else buttons.push([["👤Реєстрація", MENU.option[1]]]);
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
  .func<StateType>(async state => {
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
    let user = state.data.storage.user = await api.getUserByTelegram(state.core.userId);
    console.log(user);
    // if(!user) return CHAIN.EXIT;
  })
  .send<StateType>(async state => {
    console.log(123);
    let mention = "Тебе";
    let options = [
      "⭐️Отримати корисну інформацію",
      "⭐️Зв'язатися з організаторами",
    ];
    if(state.data.storage.user) {
      const chatMember = await Bot.getChatMember(state.core.chatId, state.data.storage.user.telegramId);
      mention = `<a href="tg://user?id={data.storage.user.telegramId}">@${chatMember.user.username ?? chatMember.user.first_name}</a>, тебе`;
      options.push("⭐️Змінити свої дані");
    }
    else {
      options.push("⭐️Подати заявку на вступ");
    }
    return `<b><u>Головне меню</u></b>\n\n${mention} вітає українська ініціатива настільних рольових ігор у Німеччині "Мрієтворці | The DreamForgers"!\n\n<b>Через нашого телеграм бота ти можеш:</b>\n\n${options.join("\n")}`;
  }, startButtons.get, editLast());