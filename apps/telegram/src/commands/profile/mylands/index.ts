import { afterInit } from "../../../afterInit";
import { getUserMemberships } from "../../../api";
import { StateType } from "../../../custom/hooks/state";
import { CONTROL, MENU } from "../../mapping";
import { optionsField } from "../../presets/options";
import { parseRoles } from "../roles";
import { landAdminRoutes } from "./landadmin/routes";

afterInit.push(landAdminRoutes);

export const $myLands = optionsField<StateType>(
  async state => {
    if(!state.data.storage.user) return "ПОМИЛКА!";
    const memberships = await getUserMemberships(state.data.storage.user);
    let participant = memberships.participant.map(m => m.land.name).join(", ");
    let guest = memberships.guest.map(m => m.land.name).join(", ");
    if(participant !== "") participant = "\n<b>Учасник</b>: " + participant;
    if(guest !== "") guest = "\n<b>Гість</b>: " + guest;
    const roles = (await parseRoles(state, ["name"], "all")).join("\n");
    return `<b><u>👤Профіль: Мої осередки</u></b>\n${participant}${guest}\n\n<b>Всі твої ролі:</b>\n<i>${roles}</i>`;
  },
  async state => {
    return [
      [["📍Панель осередків", MENU.option[0]]],
      [["🔁Змінити осередок*", MENU.option[1]], ["👋Стати гостем", MENU.option[2]]],
      [["⬅️Назад", CONTROL.back]]
    ];
  }
);