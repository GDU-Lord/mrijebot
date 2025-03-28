import { getUserMemberships } from "../../../api";
import { Land } from "../../../app/entities/land.entity";
import { keyboard } from "../../../custom/hooks/buttons";
import { saveValue } from "../../../custom/hooks/options";
import { StateType } from "../../../custom/hooks/state";
import { CONTROL, MENU } from "../../mapping";
import { optionsField } from "../../presets/options";

export const $myLands = optionsField<StateType>(
  async state => {
    if(!state.data.storage.user) return "ПОМИЛКА!";
    const memberships = await getUserMemberships(state.data.storage.user);
    let participant = memberships.participant.map(m => m.land.name).join(", ");
    let guest = memberships.guest.map(m => m.land.name).join(", ");
    if(participant !== "") participant = "\n<b>Учасник</b>: " + participant;
    if(guest !== "") guest = "\n<b>Гість</b>: " + guest;
    return `<b><u>👤Профіль: Мої осередки</u></b>\n${participant}${guest}`;
  },
  async state => {
    return [
      [["📍Панель осередків", MENU.option[0]]],
      [["🔁Змінити осередок*", MENU.option[1]], ["👋Стати гостем", MENU.option[2]]],
      [["⬅️Назад", CONTROL.back]]
    ];
  }
);