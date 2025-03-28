import { getInputOptionsList } from "../../../custom/hooks/inputs";
import { toggleButtons, toggleValue, toggleValueInput } from "../../../custom/hooks/options";
import { GAME_TYPES } from "../../form/register/mapping";
import { text } from "../../form/validators";
import { CONTROL } from "../../mapping";
import { optionsField } from "../../presets/options";
import { optionsOtherField } from "../../presets/optionsOther";

export const $systemsPreferred = optionsOtherField(
  "lastInput",
  async state => {
    const list = getInputOptionsList(state, "masterPanel", "systemsPreferred", text());
    return `<b><u>👤Профіль: Твої системи</u></b>\n\nУ які Настільні Рольові Системи ти плануєш водити?\n\nТи можеш додати власні варіанти, ввівши їх у повідомленні. Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\n✍️<b>Введені вручну:</b> ${list.join("; ")}`;
  },
  toggleButtons(
    "masterPanel:systemsPreferred", 
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
  toggleValue("masterPanel:systemsPreferred", CONTROL.back),
  toggleValueInput("masterPanel:systemsPreferred")
);

export const $gamesPreferred = optionsField(
  async state => {
    return `<b><u>👤Профіль: Види ігор</u></b>\n\nЯкі види Настільних Рольових Ігор ти плануєш водити?\n\n<b>Ваншот</b>: одна сесія\n<b>Міні-кампанія</b>: до 5 сесій\n<b>Кампанія</b>: 5+ сесій\n`;
  },
  toggleButtons(
    "masterPanel:gamesPreferred", 
    [
      [["Ваншоти", GAME_TYPES.one_shot]],
      [["Міні-кампанії", GAME_TYPES.short_campaign]],
      [["Кампанії", GAME_TYPES.long_campaign]],
      [["✔️Зберегти", CONTROL.back]],
    ],
    "✅ ",
    "",
    CONTROL.back),
  toggleValue("masterPanel:gamesPreferred", CONTROL.back),
);