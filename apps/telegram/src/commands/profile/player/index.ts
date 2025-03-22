import { profile } from "console";
import { afterInit } from "../../../afterInit.js";
import { getLastCallback } from "../../../custom/hooks/buttons.js";
import { optionsField } from "../../presets/options.js";
import { profilePlayerRoutes } from "./routes.js";

afterInit.push(profilePlayerRoutes);

export const $playerPanel = optionsField(
  async state => {
    return `<b><u>👤Профіль: Панель гравця</u></b>\n\nМайстри ваших осередків можуть отримати доступ до цих даних, щоб зробити ваш ігровий досвід якомога приємнішим!`;
  },
  [
    [["🎲 Ігрові системи", 1], ["♦️ Мій досвід", 2]],
    [["👍Мої вподобання", 3], ["🥲Мої тригери", 4]],
    [["⬅️Назад", 0]],
  ],
  async (state, buttons) => {
    const data = getLastCallback(state, buttons);
  }
);