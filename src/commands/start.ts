import TelegramBot from "node-telegram-bot-api";
import { procedure } from "../core/chain.js";
import { CHAIN } from "../core/actions.js";
import { $info } from "./info.js";
import { $email } from "./form/register/index.js";
import { createButtons, keyboard } from "../custom/hooks/buttons.js";
import { addCrum } from "../custom/hooks/menu.js";
import { editLast } from "../custom/hooks/messageOptions.js";
import { routeCallback } from "../custom/hooks/routes.js";
import { initState, StateType } from "../custom/hooks/state.js";
import { User } from "../app/entities/user.entity.js";
import { Member } from "../app/entities/member.entity.js";
import { Land } from "../app/entities/land.entity.js";
import { Bot } from "../core/index.js";
import { $main } from "./profile/index.js";

export const startButtons = createButtons<StateType>(async state => {
  const buttons: keyboard = [
    [["ℹ️ Інформація", 1]]
  ];
  if(state.data.storage.user) buttons.push([["👤Мій профіль", 3]]);
  else buttons.push([["👤Реєстрація", 2]]);
  return buttons;
});

routeCallback(startButtons, 1, $info);
routeCallback(startButtons, 2, $email.proc);
routeCallback(startButtons, 3, $main.proc);

export const $start = procedure();
$start.make()
  .func(async state => {
    if(state.data == null && (state.lastInput as TelegramBot.Message).chat.type !== "private")
      return CHAIN.NEXT_LISTENER;
    return CHAIN.NEXT_ACTION;
  })
  .func(initState(true))
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
    let user = state.data.storage.user;
    if(!user) { // emulate user
      user = new User;
      user.id = 1;
      user.telegramId = state.core.userId;
      user.email = "usertest@example.com";
      user.city = "Berlin";
      user.memberships = [];
      {
        const member = new Member;
        member.id = 2;
        member.isLandAdmin = false;
        member.user = user;
        member.userId = 1;
        member.status = "participant";
        const land = new Land;
        land.id = 3;
        land.members = [member];
        land.name = "Berlin";
        land.region = "Berlin, Brandenburg";
        member.land = land;
        member.landId = land.id;
        user.memberships.push(member);
      }
      {
        const member = new Member;
        member.id = 4;
        member.isLandAdmin = false;
        member.user = user;
        member.userId = 1;
        member.status = "guest";
        const land = new Land;
        land.id = 5;
        land.members = [member];
        land.name = "Niedersachsen";
        land.region = "Bremen, Hamburg, Niedersachsen";
        member.land = land;
        member.landId = land.id;
        user.memberships.push(member);
      }
      {
        const member = new Member;
        member.id = 6;
        member.isLandAdmin = false;
        member.user = user;
        member.userId = 1;
        member.status = "guest";
        const land = new Land;
        land.id = 7;
        land.members = [member];
        land.name = "Mecklenburg-Vorpommen";
        land.region = "Mecklenburg-Vorpommen";
        member.land = land;
        member.landId = land.id;
        user.memberships.push(member);
      }
      state.data.storage.user = user;
    }
  })
  .send<StateType>(async state => {
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