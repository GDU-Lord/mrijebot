import { afterInit } from "../../../afterInit";
import { StateType } from "../../../custom/hooks/state";
import { optionsField } from "../../presets/options";
import { profileMasterRoutes } from "./routes";

afterInit.push(profileMasterRoutes);

export const $masterPanel = optionsField<StateType>(async state => {
  return `<b><u>👤Профіль: Панель майстра</u></b>\n\n`;
},
[
  [["🎲 Ігрові системи", 1], ["⏳Види ігор", 2]],
  [["♦️ Мій досвід", 3], ["👤Дані гравця", 4]],
  [["⬅️Назад", 0]],
]);

// add BECOME MASTER for non-masters