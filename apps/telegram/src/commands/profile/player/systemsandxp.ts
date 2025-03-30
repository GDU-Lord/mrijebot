import { getSystems } from "../../../api";
import { keyboard } from "../../../custom/hooks/buttons";
import { getInputOptionsList } from "../../../custom/hooks/inputs";
import { toggleButtons, toggleValue, toggleValueInput } from "../../../custom/hooks/options";
import { StateType } from "../../../custom/hooks/state";
import { text } from "../../form/validators";
import { CONTROL, MENU } from "../../mapping";
import { optionsField } from "../../presets/options";
import { optionsOtherField } from "../../presets/optionsOther";

export const $experience = optionsField(async state => {
  return `<b><u>👤Профіль: Досвід гравця</u></b>\n\nТут ти можеш змінити дані свого досвіду в НРІ (як гравця)`;
},
[
  [["🎲 Зіграні системи", MENU.option[0]], ["♦️ Зіграні сесії*", MENU.option[1]]],
  [["⬅️Назад", CONTROL.back]]
]);

export const $systemsPlayed = optionsOtherField(
  "lastInput",
  async state => {
    state.data.storage.systems = await getSystems() ?? [];
    const list = getInputOptionsList(state, "playerPanel", "systemsPlayed", text());
    return `<b><u>👤Профіль: Досвід гравця</u></b>\n\n🎲 У яких Настільних Рольових Системах ти маєш досвід як гравець?\n\nℹ️ Ти можеш додати власні варіанти, ввівши їх у повідомленні.\nℹ️ Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\n✍️<b>Введені вручну:</b> ${list.join("; ")}`;
  },
  toggleButtons<StateType>(
      "playerPanel:systemsPlayed", 
      async state => {
        const buttons = state.data.storage.systems.map(s => {
          return [[s.name, s.id]];
        }) as keyboard;
        return [
          ...buttons, 
          [["✔️Зберегти", CONTROL.back]],
        ];
      }, 
      "✅ ",
      "", 
      CONTROL.back),
  text(),
  toggleValue("playerPanel:systemsPlayed", CONTROL.back),
  toggleValueInput("playerPanel:systemsPlayed")
);

export const $gamesPlayed = optionsField(
  async state => {
    return `<b><u>👤Профіль: Досвід гравця</u></b>\n\nСкільки в тебе досвіду в НРІ як гравця?\n\n<b>ℹ️ Сесія</b> - зазвичай триває 3-6 годин\n<b>ℹ️ Ваншот</b> - цілісна гра на одну сесію\n<b>ℹ️ Міні-кампанія</b> - гра до 5 сесій\n<b>ℹ️ Кампанія</b> - гра, що триває більше 5 сесій і може тривати й роками.`
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