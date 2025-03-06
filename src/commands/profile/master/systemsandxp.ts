import { getInputOptionsList } from "../../../custom/hooks/inputs.js";
import { toggleButtons, toggleValue, toggleValueInput } from "../../../custom/hooks/options.js";
import { text } from "../../form/validators.js";
import { optionsField } from "../../presets/options.js";
import { optionsOtherField } from "../../presets/optionsOther.js";

export const $experience = optionsField(async state => {
  return `<b><u>👤Профіль: Досвід майстра</u></b>\n\nТут ти можеш змінити дані свого досвіду в НРІ (як майстра)`;
},
[
  [["🎲 Проведені системи", 1], ["♦️ Проведені сесії", 2]],
  [["⬅️Назад", 0]]
]);

export const $systemsMastered = optionsOtherField(
  "lastInput",
  async state => {
    const list = getInputOptionsList(state, "masterPanel", "systemsMastered", text());
    return `<b><u>👤Профіль: Досвід майстра</u></b>\n\nУ які Настільні Рольові Системи ти водив(ла/ли)?\n\nТи можеш додати власні варіанти, ввівши їх у повідомленні. Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\nВведені вручну: ${list.join("; ")}`;
  },
  toggleButtons(
    "masterPanel:systemsMastered", 
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
  toggleValue("masterPanel:systemsMastered", 0),
  toggleValueInput("masterPanel:systemsMastered")
);

export const $gamesMastered = optionsField(
  async state => {
    return `<b><u>👤Профіль: Досвід майстра</u></b>\n\nСкільки в тебе досвіду в НРІ як майстра?`
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