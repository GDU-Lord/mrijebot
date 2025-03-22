import { getInputOptionsList } from "../../../custom/hooks/inputs.js";
import { toggleButtons, toggleValue, toggleValueInput } from "../../../custom/hooks/options.js";
import { text } from "../../form/validators.js";
import { optionsField } from "../../presets/options.js";
import { optionsOtherField } from "../../presets/optionsOther.js";

export const $systemsPreferred = optionsOtherField(
  "lastInput",
  async state => {
    const list = getInputOptionsList(state, "masterPanel", "systemsPreferred", text());
    return `<b><u>👤Профіль: Твої системи</u></b>\n\nУ які Настільні Рольові Системи ти плануєш водити?\n\nТи можеш додати власні варіанти, ввівши їх у повідомленні. Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\nВведені вручну: ${list.join("; ")}`;
  },
  toggleButtons(
    "masterPanel:systemsPreferred", 
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
  toggleValue("masterPanel:systemsPreferred", 0),
  toggleValueInput("masterPanel:systemsPreferred")
);

export const $gamesPreferred = optionsField(
  async state => {
    return `<b><u>👤Профіль: Види ігор</u></b>\n\nЯкі види Настільних Рольових Ігор ти плануєш водити?\n\n<b>Ваншот</b>: одна сесія\n<b>Міні-кампанія</b>: до 5 сесій\n<b>Кампанія</b>: 5+ сесій\n`;
  },
  toggleButtons(
    "masterPanel:gamesPreferred", 
    [
      [["Ваншоти", 1]],
      [["Міні-кампанії", 2]],
      [["Кампанії", 3]],
      [["✔️Зберегти", 0]],
    ],
    "✅ ",
    "",
    0),
  toggleValue("masterPanel:gamesPreferred", 0),
);