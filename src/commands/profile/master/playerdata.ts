import TelegramBot from "node-telegram-bot-api";
import { StateType } from "../../../custom/hooks/state.js";
import { optionsOtherField } from "../../presets/optionsOther.js";
import { optionsField } from "../../presets/options.js";

function getUserData(msg: TelegramBot.Message): [string | null, number | null] {
  for(const e of msg?.entities ?? []) {
    if(e.type === "mention") {
      const username = msg.text?.match(/@[A-Za-z0-9_]{0,}/g)?.[0].replace("@", "") ?? null;
      // find user by username
      return [username, null];
    }
  }
  // analyse the card
  const text = msg.text;
  if(text == null) return [null, null];
  const match = text.match(/(?<=TelegramId:\s*)\d+/g)?.[0] ?? "";
  const telegramId = +match;
  return [null, telegramId];
}

export const $playerData = optionsOtherField<StateType>(
  "lastInput",
  async state => {
    return `<b><u>👤Палень майстра: Дані гравця</u></b>\n\nТегни свого гравця!\n\n❕Якщо в нього/неї немає тегу в Телеграмі, попроси його/її переслати тобі свою Ідентифікаційну Картку.\n❕Її можна знайти у <b>Профіль</b> > <b>Ідентифікаційна Картка</b>\n❕Перешли цю картку сюди в чат замість тега гравця (у вигляді повідомлення)!`;
  },
  [
    [["⬅️Назад", 0]]
  ],
  (text, msg) => {
    const [username, telegramId] = getUserData(msg);
    if(username) {
      console.log("username", username);
      return true
    }
    if(telegramId) {
      console.log("telegramId", telegramId);
      return true;
    }
    return false;
  },
  async () => {},
  async state => {
    const data = "User data here";
    state.data.options["masterPanel:userData"] = data;
    await state.call($displayPlayerData.proc);
  }
);

export const $displayPlayerData = optionsField<StateType>(
  async state => {
    return `<b><u>👤Палень майстра: Дані гравця ІМ'Я</u></b>\n\n${state.data.options["masterPanel:userData"]}`;
  },
  [
    [["⬅️Назад", 0]]
  ]
);