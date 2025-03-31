import { profile } from "console";
import { afterInit } from "../../../afterInit";
import { getLastCallback } from "../../../custom/hooks/buttons";
import { optionsField } from "../../presets/options";
import { profilePlayerRoutes } from "./routes";
import { CONTROL, MENU } from "../../mapping";

afterInit.push(profilePlayerRoutes);

export const $playerPanel = optionsField(
  async state => {
    return `<b><u>👤Профіль: Панель гравця</u></b>\n\nМайстри ваших осередків можуть отримати доступ до цих даних, щоб зробити ваш ігровий досвід якомога приємнішим!`;
  },
  [
    [["🎲 Ігрові системи", MENU.option[0]], ["♦️ Мій досвід", MENU.option[1]]],
    [["👍Мої вподобання", MENU.option[2]], ["🥲Мої тригери", MENU.option[3]]],
    [["⬅️Назад", CONTROL.back]],
  ],
  async (state, buttons) => {
    const data = getLastCallback(state, buttons);
  }
);