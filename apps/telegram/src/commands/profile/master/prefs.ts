import { getSystems } from "../../../api";
import { keyboard } from "../../../custom/hooks/buttons";
import { getInputOptionsList } from "../../../custom/hooks/inputs";
import { toggleButtons, toggleValue, toggleValueInput } from "../../../custom/hooks/options";
import { StateType } from "../../../custom/hooks/state";
import { GAME_TYPES } from "../../form/register/mapping";
import { text } from "../../form/validators";
import { CONTROL } from "../../mapping";
import { optionsField } from "../../presets/options";
import { optionsOtherField } from "../../presets/optionsOther";

export const $systemsPreferred = optionsOtherField(
  "lastInput",
  async state => {
    state.data.storage.systems = await getSystems() ?? [];
    const list = getInputOptionsList(state, "masterPanel", "systemsPreferred", text());
    return "<b><u>👤Панель Майстра: Твої системи</u></b>\n\n🎲 Які Настільні Рольові Системи ти плануєш проводити?\n\nℹ️ Ти можеш додати власні варіанти, ввівши їх у повідомленні.\nℹ️ Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\n✍️<b>Введені вручну:</b> " + list.join("; ");
  },
  toggleButtons<StateType>(
    "masterPanel:systemsPreferred", 
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
  toggleValue("masterPanel:systemsPreferred", CONTROL.back),
  toggleValueInput("masterPanel:systemsPreferred")
);

export const $gamesPreferred = optionsField(
  async state => {
    return `<b><u>👤Панель Майстра: Види ігор</u></b>\n\n🎲 Які види НРІ цікавлять тебе як майстра?\n\n<b>ℹ️ Сесія</b> - зазвичай триває 3-6 годин\n<b>ℹ️ Ваншот</b> - цілісна гра на одну сесію\n<b>ℹ️ Міні-кампанія</b> - гра до 5 сесій\n<b>ℹ️ Кампанія</b> - гра, що триває більше 5 сесій і може тривати й роками.`;
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