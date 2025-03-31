import { GameSystem } from "../../../../../core/src/entities";
import { getSystems } from "../../../api";
import { keyboard } from "../../../custom/hooks/buttons";
import { getInputOptionsList } from "../../../custom/hooks/inputs";
import { saveValue, toggleButtons, toggleValue, toggleValueInput } from "../../../custom/hooks/options";
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
    state.data.storage.systems = await getSystems() ?? [];
    const list = getInputOptionsList(state, "masterPanel", "systemsPlayed", text());
    return `<b><u>👤Панель Майстра: Досвід в НРІ</u></b>\n\n🎲 У яких Настільних Рольових Системах ти маєш досвід як майстер?\n\nℹ️ Ти можеш додати власні варіанти, ввівши їх у повідомленні.\nℹ️ Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\n✍️<b>Введені вручну:</b> ${list.join("; ")}`;
  },
  toggleButtons(
    "masterPanel:systemsPlayed", 
    async state => {
      const buttons = state.data.storage.systems.map((s: GameSystem) => {
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
  toggleValue("masterPanel:systemsPlayed", CONTROL.back),
  toggleValueInput("masterPanel:systemsPlayed")
);

export const $gamesMastered = optionsField(
  async state => {
    return `<b><u>Панель Майстра: Досвід в НРІ</u></b>>\n\n🎲 Скільки в тебе досвіду в НРІ як майстра?`
  },
  async state => {
    const list = new Array(4).fill("");
    const games = state.data.options["masterPanel:gamesPlayed"] as number;
    if(games <= 5) list[0] = "✅ ";
    if(games > 5 && games <= 10) list[1] = "✅ ";
    if(games > 10 && games <= 50) list[2] = "✅ ";
    if(games > 50) list[3] = "✅ ";
    return [
      [[list[0] + "До 5 сесій", 5]],
      [[list[1] + "Від 6 до 10 сесій", 10]],
      [[list[2] + "Від 11 до 50 сесій", 50]],
      [[list[3] + "Понад 50 сесій", 100]],
      [["✔️Зберегти", CONTROL.back]],
    ]
  },
  saveValue("masterPanel:gamesPlayed", CONTROL.back)
);