import TelegramBot from "node-telegram-bot-api";
import { StateType } from "../../../custom/hooks/state";
import { optionsOtherField } from "../../presets/optionsOther";
import { optionsField } from "../../presets/options";
import { CONTROL } from "../../mapping";
import { Bot } from "../../../core";
import { getUser } from "../../../api";
import { CHAIN } from "../../../core/actions";

function getUserId(msg: TelegramBot.Message): number | null {
  const text = msg.text;
  if(!text) return null;
  const userId = text.match(/(?<=UserId:\s*)\d+/g)?.[0] ?? "";
  return +userId;
}

export const $playerData = optionsOtherField<StateType>(
  "lastInput",
  async state => {
    console.log("?");
    return `<b><u>👤Палень Майстра: Дані гравця</u></b>\n\nℹ️ Попроси гравця переслати тобі свою Ідентифікаційну Картку.\n\nℹ️ Її можна знайти у <b>Профіль</b> > <b>Ідентифікаційна Картка</b>\n\nℹ️ Перешли цю картку сюди в чат замість тега гравця (у вигляді повідомлення)!`;
  },
  [
    [["⬅️Назад", CONTROL.back]]
  ],
  (text, msg) => {
    const userId = getUserId(msg);
    return !!userId;
  },
  async () => {},
  async state => {
    const userId = getUserId(state.lastInput as TelegramBot.Message)!;
    console.log(userId);
    const user = await getUser(userId);
    console.log(user);
    if(!user) {
      state.data.options["masterPanel:userData"] = "Помилка! Користувача не знайдено!";
      state.call($displayPlayerData.proc);
      return CHAIN.EXIT;
    }
    const gamesPlayed = user.playerGamesPlayed;
    const systemsPlayed: string = [...user.playerPlayedGameSystems.map(s => s.name), ...user.customPlayerPlayedGameSystems].join("; ");
    const systemsPreferred = [...user.playerPreferredGameSystems.map(s => s.name), ...user.customPlayerPreferredGameSystems].join("; ");
    const message = user.playerMasterMessage;
    const triggers = user.playerTriggers;
    state.data.options["masterPanel:userData"] = `<b>🔮Зігано сесій:</b> ~${gamesPlayed}\n\n<b>♦️Досвід у системах:</b> ${systemsPlayed}\n\n<b>🎲 Цікавлять системи:</b>\n${systemsPreferred}\n\n<b>‼️Тригери:</b>\n${triggers}\n\n<b>💌 Послання майстру:</b>\n${message}`;
    state.call($displayPlayerData.proc);
    return CHAIN.EXIT;
  }
);

export const $displayPlayerData = optionsField<StateType>(
  async state => {
    console.log("OPTION");
    return `<b><u>👤Палень Майстра: Дані гравця</u></b>\n\n${state.data.options["masterPanel:userData"]}`;
  },
  [
    [["⬅️Назад", CONTROL.back]]
  ]
);