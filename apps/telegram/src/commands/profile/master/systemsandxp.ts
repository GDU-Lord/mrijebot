import { getInputOptionsList } from "../../../custom/hooks/inputs";
import { toggleButtons, toggleValue, toggleValueInput } from "../../../custom/hooks/options";
import { text } from "../../form/validators";
import { CONTROL, MENU } from "../../mapping";
import { optionsField } from "../../presets/options";
import { optionsOtherField } from "../../presets/optionsOther";

export const $experience = optionsField(async state => {
  return `<b><u>👤Профіль: Досвід майстра</u></b>\n\nТут ти можеш змінити дані свого досвіду в НРІ (як майстра)`;
},
[
  [["🎲 Проведені системи", MENU.option[0]], ["♦️ Проведені сесії", MENU.option[1]]],
  [["⬅️Назад", CONTROL.back]]
]);

export const $systemsMastered = optionsOtherField(
  "lastInput",
  async state => {
    const list = getInputOptionsList(state, "masterPanel", "systemsMastered", text());
    return `<b><u>👤Профіль: Досвід майстра</u></b>\n\nУ які Настільні Рольові Системи ти водив(ла/ли)?\n\nТи можеш додати власні варіанти, ввівши їх у повідомленні. Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\n✍️<b>Введені вручну:</b> ${list.join("; ")}`;
  },
  toggleButtons(
    "masterPanel:systemsMastered", 
    [
      [["ДнД", 1]],
      [["Кіберпанк", 2]],
      [["Савага", 3]],
      [["Архетерика", 4]],
      [["✔️Зберегти", CONTROL.back]],
    ],
    "✅ ",
    "",
    CONTROL.back),
  text(),
  toggleValue("masterPanel:systemsMastered", CONTROL.back),
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
      [["✔️Зберегти", CONTROL.back]],
    ]
  }
);