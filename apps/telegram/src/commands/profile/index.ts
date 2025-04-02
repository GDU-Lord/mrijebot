import { afterInit } from "../../afterInit";
import { getLands, getLandsById, getUserMemberships } from "../../api";
import { Bot } from "../../core";
import { CHAIN } from "../../core/actions";
import { keyboard } from "../../custom/hooks/buttons";
import { StateType } from "../../custom/hooks/state";
import { CONTROL, MENU } from "../mapping";
import { optionsField } from "../presets/options";
import { isGlobalAdmin } from "./admin/hooks";
import { parseRoles } from "./roles";
import { profileRoutes } from "./routes";

afterInit.push(profileRoutes);

export const $main = optionsField<StateType>(
  async state => {
    if(!state.data.storage.user) return "ПОМИЛКА!";
    const memberships = await getUserMemberships(state.data.storage.user);
    let participant = memberships.participant.map(m => m.land.name).join(", ");
    let guest = memberships.guest.map(m => m.land.name).join(", ");
    if(participant !== "") participant = "\n<b>Членство</b>: " + participant;
    if(guest !== "") guest = "\n<b>Гість</b>: " + guest;
    // const status = "\n<b>Статус</b>: Координатор Ініціативи (Koordinator)";
    const status = `\n<b>Статус</b>: <i>${(await parseRoles(state, ["name", "publicName"], "all", "position", true))[0]}</i>`;
    // Координатор Ініціативи (Koordinator*in)
    // Куратор Заснування Осередку (Gründungskurator*in der Ortsgruppe)
    // Заступник Координатора Ініціативи (Stellertretende*r Koordinator*in)
    // Координатор Осередку (Ortskurator*in)
    // Організатор Осередку (Organisator*in)
    // Учасник Осередку (Teilnehmer*in)
    // Гість Осередку (Gast)
    const chatMember = await Bot.getChatMember(state.core.chatId, +state.data.storage.user.telegramId);
    return `<b><u>👤Профіль</u></b>\n\n<b>Ім'я</b>: ${chatMember.user.first_name}\n<b>Займенники</b>: <i>в розробці</i>\n<b>Email</b>: {data.storage.user.email}${status}${participant}${guest}`;
  },
  async state => {
    const buttons: keyboard = [
      [["📍Мої осередки", MENU.option[0]], ["📧 Контактні дані*", MENU.option[1]]],
      [["💙Панель гравця", MENU.option[2]], ["💛Панель майстра", MENU.option[3]]],
      [["⚙️Налаштування оголошень*", MENU.option[4]]],
      [["💳Ідентифікаційна Картка", MENU.option[5]]],
    ];
    if(await isGlobalAdmin(state)) buttons.push([["®️Адмінська Панель", MENU.option[6]]]);
    buttons.push([["⬅️Назад", CONTROL.back]]);
    return buttons;
  }
);