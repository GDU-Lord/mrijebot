import { afterInit } from "../../../afterInit";
import { CONTROL, MENU } from "../../mapping";
import { optionsField } from "../../presets/options";
import { adminRoutes } from "./routes";

afterInit.push(adminRoutes);

export const $admin = optionsField(
  async () => {
    return `<u><b>Адмінська Панель</b></u>\n\nТут ти можеш управляти ролями та посадами!\n\nДля управління Осередками перейди у розділ Осередків у меню свого профіля!`;
  },
  async () => {
    return [
      [["Список учасників", MENU.option[0]]],
      [["Змінити роль", MENU.option[1]]],
      [["Назначити роль", MENU.option[2]]],
      [["Забрати роль", MENU.option[3]]],
      [["Архівувати роль", MENU.option[4]]],
      [["⬅️Назад", CONTROL.back]],
    ];
  });