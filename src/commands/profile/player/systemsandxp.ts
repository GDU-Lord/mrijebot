import { getInputOptionsList } from "../../../custom/hooks/inputs.js";
import { toggleButtons, toggleValue, toggleValueInput } from "../../../custom/hooks/options.js";
import { text } from "../../form/validators.js";
import { optionsField } from "../../presets/options.js";
import { optionsOtherField } from "../../presets/optionsOther.js";

export const $experience = optionsField(async state => {
  return `<b><u>👤Профіль: Досвід гравця</u></b>\n\nТут ти можеш змінити дані свого досвіду в НРІ (як гравця)`;
},
[
  [["🎲 Зіграні системи", 1], ["♦️ Зіграні сесії", 2]],
  [["⬅️Назад", 0]]
]);

export const $systemsPlayed = optionsOtherField(
  "lastInput",
  async state => {
    const list = getInputOptionsList(state, "playerPanel", "systemsPlayed", text());
    return `<b><u>👤Профіль: Досвід гравця</u></b>\n\nУ які Настільні Рольові Системи ти грав(ла/ли)?\n\nТи можеш додати власні варіанти, ввівши їх у повідомленні. Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\nВведені вручну: ${list.join("; ")}`;
  },
  toggleButtons(
    "playerPanel:systemsPlayed", 
    [
      [["ДнД", 1]],
      [["Кіберпанк", 2]],
      [["Савага", 3]],
      [["Архетерика", 4]],
      [["✔️Зберегти", 0]],
    ],
    "✅ ",
    "",
    0),
  text(),
  toggleValue("playerPanel:systemsPlayed", 0),
  toggleValueInput("playerPanel:systemsPlayed")
);

export const $gamesPlayed = optionsField(
  async state => {
    return `<b><u>👤Профіль: Досвід гравця</u></b>\n\nСкільки в тебе досвіду в НРІ як гравця?`
  },
  async state => {
    // highlight the current one
    return [
      [["До 5 сесій", 1]],
      [["Від 5 до 10 сесій", 2]],
      [["Від 10 до 50 сесій", 3]],
      [["Понад 50 сесій", 4]],
      [["✔️Зберегти", 0]],
    ]
  }
);