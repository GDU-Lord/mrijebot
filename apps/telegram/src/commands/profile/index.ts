import { afterInit } from "../../afterInit";
import { getUserMemberships } from "../../api";
import { Bot } from "../../core";
import { key, keyboard } from "../../custom/hooks/buttons";
import { StateType } from "../../custom/hooks/state";
import { loadUser } from "../loaduser";
import { CONTROL, MENU } from "../mapping";
import { optionsField } from "../presets/options";
import { hasGlobalRole, hasLocalRole, isGlobalAdmin, isMaster, parseRoles } from "./roles";
import { profileRoutes } from "./routes";

afterInit.push(profileRoutes);

export const $main = optionsField<StateType>(
  async state => {
    await loadUser(state);
    const user = state.data.storage.user;
    if(!user) return "ПОМИЛКА!";
    const memberships = await getUserMemberships(user);
    let participant = memberships.participant.map(m => m.land.name).join(", ");
    let guest = memberships.guest.map(m => m.land.name).join(", ");
    if(participant !== "") participant = "\n<b>Членство</b>: " + participant;
    if(guest !== "") guest = "\n<b>Гість</b>: " + guest;
    const status = `\n<b>Статус</b>: <i>${(await parseRoles(state, ["name", "publicName"], "all", "position", true))[0]}</i>`;
    // const chatMember = await Bot.getChatMember(state.core.chatId, +user.telegramId);
    return `<b><u>👤Профіль</u></b>\n\n<b>Ім'я</b>: ${user.username}\n<b>Займенники</b>: <i>в розробці</i>\n<b>Email</b>: {data.storage.user.email}${status}${participant}${guest}`;
  },
  async state => {
    const masterButton: key = await isMaster(state) ? ["💛Панель майстра", MENU.option[3]] : ["✨Стати майстром", MENU.option[7]]; 
    
    const buttons: keyboard = [
      [["📍Мої осередки", MENU.option[0]], ["📧 Контактні дані", MENU.option[1]]],
      [["💙Панель гравця", MENU.option[2]], masterButton],
    ];

    if(await hasLocalRole(state, "local_announce") || await hasGlobalRole(state, "global_announce") || await hasGlobalRole(state, "master"))
      buttons.push([["⚙️Мої оголошення", MENU.option[4]]]);

    buttons.push([["💳Ідентифікаційна Картка", MENU.option[5]]]);

    if(await isGlobalAdmin(state))
      buttons.push([["®️Адмінська Панель", MENU.option[6]]]);

    buttons.push([["⬅️Назад", CONTROL.back]]);
    
    return buttons;
  }
);