import { Land } from "../../../app/entities/land.entity.js";
import { keyboard } from "../../../custom/hooks/buttons.js";
import { saveValue } from "../../../custom/hooks/options.js";
import { StateType } from "../../../custom/hooks/state.js";
import { optionsField } from "../../presets/options.js";

export const $myLands = optionsField<StateType>(
  async state => {
    let member = state.data.storage.user?.memberships.filter(m => m.status === "participant").map(m => m.land.name).join(", ");
    let guest = state.data.storage.user?.memberships.filter(m => m.status === "guest").map(m => m.land.name).join(", ");
    if(member !== "") member = "\n<b>Членство</b>: " + member;
    if(guest !== "") guest = "\n<b>Гість</b>: " + guest;
    return `<b><u>👤Профіль: Мої осередки</u></b>\n${member}${guest}`;
  },
  async state => {
    return [
      [["📍Панель осередків", 1]],
      [["🔁Змінити членство", 2], ["👋Стати гостем", 3]],
      [["⬅️Назад", 0]]
    ];
  }
);