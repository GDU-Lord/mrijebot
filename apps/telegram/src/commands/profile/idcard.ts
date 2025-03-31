import { StateType } from "../../custom/hooks/state";
import { CONTROL } from "../mapping";
import { optionsField } from "../presets/options";

export const $idCard = optionsField<StateType>(
  async state => `<b><u>Ідентифікаційна Картка</u></b>\n\nUserId: {data.storage.user.id}`,
  [
    [["⬅️Назад", CONTROL.back]]
  ]
);