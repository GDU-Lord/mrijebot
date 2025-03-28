import { afterInit } from "../../../afterInit";
import { StateType } from "../../../custom/hooks/state";
import { CONTROL, MENU } from "../../mapping";
import { optionsField } from "../../presets/options";
import { profileMasterRoutes } from "./routes";

afterInit.push(profileMasterRoutes);

export const $masterPanel = optionsField<StateType>(async state => {
  return `<b><u>👤Профіль: Панель майстра</u></b>\n\n`;
},
[
  [["🎲 Ігрові системи", MENU.option[0]], ["⏳Види ігор", MENU.option[1]]],
  [["♦️ Мій досвід", MENU.option[2]], ["👤Дані гравця", MENU.option[3]]],
  [["⬅️Назад", CONTROL.back]],
]);

// add BECOME MASTER for non-masters