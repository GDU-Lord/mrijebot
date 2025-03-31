import { $playerPanel } from ".";
import { getSystems } from "../../../api";
import { procedure } from "../../../core/chain";
import { LocalState } from "../../../core/state";
import { buttonsGenerator, getLastCallback, keyboard } from "../../../custom/hooks/buttons";
import { getInputOptionsList } from "../../../custom/hooks/inputs";
import { call } from "../../../custom/hooks/menu";
import { saveValue, saveValueInput, toggleButtons, toggleValue, toggleValueInput } from "../../../custom/hooks/options";
import { StateType } from "../../../custom/hooks/state";
import { GAME_TYPES } from "../../form/register/mapping";
import { text } from "../../form/validators";
import { CONTROL, MENU } from "../../mapping";
import { optionsField } from "../../presets/options";
import { optionsOtherField } from "../../presets/optionsOther";

export const $myTriggers = optionsOtherField<StateType>(
  "lastInput",
  async state => {
    let triggers = state.data.options["playerPanel:triggers"] ?? "";
    if(triggers === "") triggers = "<i>(немає)</i>";
    return `<b><u>👤Профіль: Тригери в іграх</u></b>\n\nТут ти можеш описати неприйнятні для тебе теми та речі у іграх.\n\n<b>Твої поточні тригери:</b>\n\n${triggers}`;
  },
  [
    [["❌Очистити", CONTROL.clear]],
    [["✔️Зберегти", CONTROL.back]]
  ],
  text(),
  async (state, buttons) => {
    const data = getLastCallback(state, buttons);
    if(data === CONTROL.clear) state.data.options["playerPanel:triggers"] = "";
  },
  saveValueInput("playerPanel:triggers")
);

export const $systemsPreferred = optionsOtherField(
  "lastInput",
  async state => {
    state.data.storage.systems = await getSystems() ?? [];
    const list = getInputOptionsList(state, "playerPanel", "systemsPreferred", text());
    return "<b><u>👤Панель Гравця: Досвід в НРІ</u></b>\n\n🎲 У які Настільні Рольові Системи ти плануєш грати?\n\nℹ️ Ти можеш додати власні варіанти, ввівши їх у повідомленні.\nℹ️ Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\n✍️<b>Введені вручну:</b> " + list.join("; ");
  },
  toggleButtons<StateType>(
    "playerPanel:systemsPreferred", 
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
  toggleValue("playerPanel:systemsPreferred", CONTROL.back),
  toggleValueInput("playerPanel:systemsPreferred")
);

export const $prefferences = optionsField(
  async state => {
    return `<b><u>👤Панель Гравця: Вподобання в НРІ</u></b>`;
  },
  [
    [["🎲 Аспекти гри", MENU.option[0]], ["⏳Види ігор", MENU.option[1]]],
    [["💌Послання майстру", MENU.option[2]]],
    [["⬅️Назад", CONTROL.back]],
  ]
);

export const $gamesPreferred = optionsField(
  async state => {
    return `<b><u>👤Панель Гравця: Види ігор</u></b>\n\n🎲 Які види НРІ цікавлять тебе як гравця?\n\n<b>ℹ️ Сесія</b> - зазвичай триває 3-6 годин\n<b>ℹ️ Ваншот</b> - цілісна гра на одну сесію\n<b>ℹ️ Міні-кампанія</b> - гра до 5 сесій\n<b>ℹ️ Кампанія</b> - гра, що триває більше 5 сесій і може тривати й роками.`;
  },
  toggleButtons(
    "playerPanel:gamesPreferred",
    [
      [["Ваншоти", GAME_TYPES.one_shot]],
      [["Міні-кампанії", GAME_TYPES.short_campaign]],
      [["Кампанії", GAME_TYPES.long_campaign]],
      [["✔️Зберегти", CONTROL.back]],
    ],
    "✅ ",
    "",
    CONTROL.back),
  toggleValue("playerPanel:gamesPreferred", CONTROL.back),
);

export const $textForMaster = optionsOtherField<StateType>(
  "lastInput",
  async state => {
    let message = state.data.options["playerPanel:textForMaster"] ?? "";
    if(message === "") message = "<i>(немає)</i>";
    return `<b><u>👤Панель Гравця: Послання майстру</u></b>\n\n💌 Тут ти можеш описати свої вподобання та очікування. Їх зможе прочитати твій майстер.\n\n<b>Твої поточні вподобання:</b>\n\n${message}`;
  },
  [
    [["❌Очистити", CONTROL.clear]],
    [["✔️Зберегти", CONTROL.back]]
  ],
  text(),
  async (state, buttons) => {
    const data = getLastCallback(state, buttons);
    if(data === CONTROL.clear) state.data.options["playerPanel:textForMaster"] = "";
  },
  saveValueInput("playerPanel:textForMaster")
);

export const $prefFight = optionsField<StateType>(
  async state => {
    return `<b><u>👤Панель Гравця: Вподобання в НРІ</u></b>\n\n🎲 Вкажи важливість <b>БОЙОВКИ</b> для тебе`;
  },
  getAspectButtons("aspectFight"),
  saveValue("playerPanel:aspectFight", CONTROL.back)
);

export const $prefSocial = optionsField<StateType>(
  async state => {
    return `<b><u>👤Панель Гравця: Вподобання в НРІ</u></b>\n\n🎲 Вкажи важливість <b>ВІДІГРАШУ</b> для тебе`;
  },
  getAspectButtons("aspectSocial"),
  saveValue("playerPanel:aspectSocial")
);

export const $prefExplore = optionsField<StateType>(
  async state => {
    return `<b><u>👤Панель Гравця: Вподобання в НРІ</u></b>\n\n🎲 Вкажи важливість <b>ДОСЛІДЖЕННЯ</b> для тебе`;
  },
  getAspectButtons("aspectExplore"),
  saveValue("playerPanel:aspectExplore")
);

$prefExplore.chain.func<StateType>(async state => {
  state.data.crums.pop();
  state.data.crums.pop();
  state.data.crums.pop();
});

export function getAspectButtons(aspect: "aspectFight" | "aspectSocial" | "aspectExplore") {
  return async function(state: LocalState<StateType>) {
    const asp = state.data.options[`playerPanel:${aspect}`] as number | null;
    const list = new Array(3).fill("").map((v, i) => (i+1) === asp ? " ✅" : "");
    return [
      [["🟢 Висока" + list[0], 3]],
      [["🟡 Середня" + list[1], 2]],
      [["🔴 Низька" + list[2], 1]],
      [["⬅️Назад", CONTROL.back]],
    ] as keyboard;
  };
}