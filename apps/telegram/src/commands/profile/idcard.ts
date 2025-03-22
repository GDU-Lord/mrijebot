import { StateType } from "../../custom/hooks/state";
import { optionsField } from "../presets/options";

export const $idCard = optionsField<StateType>(
  async state => {
    return `<b><u>Ідентифікаційна Картка</u></b>\n\nTelegramId: {core.userId}`;
  },
  [
    [["⬅️Назад", 0]]
  ]
);