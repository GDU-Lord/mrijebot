import { getLastCallback } from "../../../custom/hooks/buttons.js";
import { getInputOptionsList } from "../../../custom/hooks/inputs.js";
import { saveValue, saveValueInput, toggleButtons, toggleValue, toggleValueInput } from "../../../custom/hooks/options.js";
import { StateType } from "../../../custom/hooks/state.js";
import { text } from "../../form/validators.js";
import { optionsField } from "../../presets/options.js";
import { optionsOtherField } from "../../presets/optionsOther.js";

export const $myTriggers = optionsOtherField<StateType>(
  "lastInput",
  async state => {
    let triggers = state.data.options["playerPanel:triggers"] ?? "<i>(немає)</i>";
    return `<b><u>👤Профіль: Тригери в іграх</u></b>\n\nТут ти можеш описати неприйнятні для тебе теми та речі у іграх.\n\n<b>Твої поточні тригери:</b>\n\n${triggers}`;
  },
  [
    [["❌Очистити", 1]],
    [["✔️Зберегти", 0]]
  ],
  text(),
  async (state, buttons) => {
    const data = getLastCallback(state, buttons);
    if(data === 1) delete state.data.options["playerPanel:triggers"];
  },
  saveValueInput("playerPanel:triggers")
);

export const $systemsPreferred = optionsOtherField(
  "lastInput",
  async state => {
    const list = getInputOptionsList(state, "playerPanel", "systemsPreferred", text());
    return `<b><u>👤Профіль: Твої системи</u></b>\n\nУ які Настільні Рольові Системи ти плануєш грати?\n\nТи можеш додати власні варіанти, ввівши їх у повідомленні. Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\nВведені вручну: ${list.join("; ")}`;
  },
  toggleButtons(
    "playerPanel:systemsPreferred", 
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
  toggleValue("playerPanel:systemsPreferred", 0),
  toggleValueInput("playerPanel:systemsPreferred")
);

export const $prefferences = optionsField(
  async state => {
    return `<b><u>👤Профіль: Вподобання в НРІ</u></b>`;
  },
  [
    [["🎲 Аспекти гри", 1], ["⏳Види ігор", 2]],
    [["💌Послання майстру", 3]],
    [["⬅️Назад", 0]],
  ]
);

export const $gamesPreferred = optionsField(
  async state => {
    return `<b><u>👤Профіль: Види ігор</u></b>\n\nУ які види Настільних Рольових Ігор ти плануєш грати?\n\n<b>Ваншот</b>: одна сесія\n<b>Міні-кампанія</b>: до 5 сесій\n<b>Кампанія</b>: 5+ сесій\n`;
  },
  toggleButtons(
    "playerPanel:gamesPreferred", 
    [
      [["Ваншоти", 1]],
      [["Міні-кампанії", 2]],
      [["Кампанії", 3]],
      [["✔️Зберегти", 0]],
    ],
    "✅ ",
    "",
    0),
  toggleValue("playerPanel:gamesPreferred", 0),
);

export const $textForMaster = optionsOtherField<StateType>(
  "lastInput",
  async state => {
    let message = state.data.options["playerPanel:textForMaster"] ?? "<i>(немає)</i>";
    return `<b><u>👤Профіль: Послання майстру</u></b>\n\nТут ти можеш описати свої вподобання та очікування. Їх зможе прочитати твій майстер.\n\n<b>Твої поточні вподобання:</b>\n\n${message}`;
  },
  [
    [["❌Очистити", 1]],
    [["✔️Зберегти", 0]]
  ],
  text(),
  async (state, buttons) => {
    const data = getLastCallback(state, buttons);
    if(data === 1) delete state.data.options["playerPanel:textForMaster"];
  },
  saveValueInput("playerPanel:textForMaster")
);

export const $prefFight = optionsField<StateType>(
  async state => {
    return `<b><u>👤Профіль: Вподобання в НРІ</u></b>\n\nВкажи важливість <b>БОЙОВКИ</b> для тебе`;
  },
  [
    [["🟢 Висока", 3]],
    [["🟡 Середня", 2]],
    [["🔴 Низька", 1]],
    [["⬅️Назад", 0]],
  ],
  saveValue("playerPanel:prefFighting")
);

export const $prefSocial = optionsField<StateType>(
  async state => {
    return `<b><u>👤Профіль: Вподобання в НРІ</u></b>\n\nВкажи важливість <b>ВІДІГРАШУ</b> для тебе`;
  },
  [
    [["🟢 Висока", 3]],
    [["🟡 Середня", 2]],
    [["🔴 Низька", 1]],
    [["⬅️Назад", 0]],
  ],
  saveValue("playerPanel:prefFighting")
);

export const $prefExplore = optionsField<StateType>(
  async state => {
    return `<b><u>👤Профіль: Вподобання в НРІ</u></b>\n\nВкажи важливість <b>ДОСЛІДЖЕННЯ</b> для тебе`;
  },
  [
    [["🟢 Висока", 3]],
    [["🟡 Середня", 2]],
    [["🔴 Низька", 1]],
    [["⬅️Назад", 0]],
  ],
  saveValue("playerPanel:prefExplore")
);

$prefExplore.chain.func<StateType>(async state => {
  state.data.crums.pop();
  state.data.crums.pop();
  state.data.crums.pop();
});