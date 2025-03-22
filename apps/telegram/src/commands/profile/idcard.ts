import { StateType } from "../../custom/hooks/state.js";
import { optionsField } from "../presets/options.js";

export const $idCard = optionsField<StateType>(
  async state => {
    return `<b><u>Ідентифікаційна Картка</u></b>\n\nTelegramId: {core.userId}`;
  },
  [
    [["⬅️Назад", 0]]
  ]
);