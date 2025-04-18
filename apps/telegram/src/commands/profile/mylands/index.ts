import { afterInit } from "../../../afterInit";
import { getLands, getUserMemberships } from "../../../api";
import { keyboard } from "../../../custom/hooks/buttons";
import { saveValue } from "../../../custom/hooks/options";
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
    const user = state.data.storage.user;
    if(!user) return [];
    const memberships = await getUserMemberships(user);
    state.data.options["profile:landsById"] = {};
    let lands: keyboard = [];
    if(user.globalRoles?.find(r => r.tag === "supervisor")) {
      const list = await getLands();
      lands = list.map(land => {
        const member = land.members.find(m => m.userId === user.id && m.status !== "suspended");
        const mark = !member ? "⚙️ " : member.status === "participant" ? "✨ " : "";
        return [[mark + land.name, land.id]];
      });
      list.forEach(land => state.data.options["profile:landsById"][land.id] = land);
    }
    else {
      lands = memberships.all.map(m => {
        const mark = m.member.status === "participant" ? "✨ " : "";
        return [[mark + m.land.name, m.land.id]];
      });
      memberships.all.forEach(m => state.data.options["profile:landsById"][m.land.id] = m.land);
    }
    return [
      ...lands,
      [["🔁Змінити осередок", MENU.option[1]], ["👋Стати гостем", MENU.option[2]]],
      [["⬅️Назад", CONTROL.back]]
    ] as keyboard;
  },
  saveValue("profile:landId", CONTROL.back, MENU.option[1], MENU.option[2])
);

// export const $myLandsList = optionsField<StateType>(
//   async state => {
//     return `<b><u>📍Панель Осередків: Мої осередки</u></b>\n\nОбери осередок, панель якого хочеш відкрити!`;
//   },
//   async state => {
//     const user = state.data.storage.user;
//     if(!user) return [];
//     const memberships = await getUserMemberships(user);
//     state.data.options["profile:landsById"] = {};
//     if(user.globalRoles?.find(r => r.tag === "supervisor")) {
//       const list = await getLands();
//       const lands = list.map(land => {
//         const member = land.members.find(m => m.userId === user.id);
//         const mark = !member ? "⚙️ " : member.status === "participant" ? "✨ " : "";
//         return [[mark + land.name, land.id]];
//       });
//       list.forEach(land => state.data.options["profile:landsById"][land.id] = land)
//       return [...lands, [["⬅️Назад", CONTROL.back]]] as keyboard;
//     }
//     const lands = memberships.all.map(m => {
//       const mark = m.member.status === "participant" ? "✨ " : "";
//       return [[mark + m.land.name, m.land.id]];
//     });
//     memberships.all.forEach(m => state.data.options["profile:landsById"][m.land.id] = m.land);
//     return [...lands, [["⬅️Назад", CONTROL.back]]] as keyboard;
//   },
//   saveValue("profile:landId", CONTROL.back)
// );