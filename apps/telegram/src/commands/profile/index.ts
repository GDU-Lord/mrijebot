import { afterInit } from "../../afterInit";
import { StateType } from "../../custom/hooks/state";
import { CONTROL, MENU } from "../mapping";
import { optionsField } from "../presets/options";
import { profileRoutes } from "./routes";

afterInit.push(profileRoutes);

export const $main = optionsField<StateType>(
  async state => {
    let member = state.data.storage.user?.memberships.filter(m => m.status === "participant").map(m => m.land.name).join(", ");
    let guest = state.data.storage.user?.memberships.filter(m => m.status === "guest").map(m => m.land.name).join(", ");
    if(member !== "") member = "\n<b>Членство</b>: " + member;
    if(guest !== "") guest = "\n<b>Гість</b>: " + guest;
    const status = "\n<b>Статус</b>: Координатор Ініціативи (Koordinator)";
    // Координатор Ініціативи (Koordinator*in)
    // Куратор Заснування Осередку (Gründungskurator*in der Ortsgruppe)
    // Заступник Координатора Ініціативи (Stellertretende*r Koordinator*in)
    // Координатор Осередку (Ortskurator*in)
    // Організатор Осередку (Organisator*in)
    // Учасник Осередку (Teilnehmer*in)
    // Гість Осередку (Gast)
    return `<b><u>👤Профіль</u></b>\n\n<b>Ім'я</b>: Вася\n<b>Займенники</b>: він/його\n<b>Email</b>: {data.storage.user.email}${status}${member}${guest}`;
  },
  async state => {
    return [
      [["📍Мої осередки", MENU.option[0]], ["📧Контактні дані", MENU.option[1]]],
      [["💙Панель гравця", MENU.option[2]], ["💛Панель майстра", MENU.option[3]]],
      [["⚙️Налаштування оголошень", MENU.option[4]]],
      [["💳Ідентифікаційна Картка", MENU.option[5]]],
      [["⬅️Назад", CONTROL.back]],
    ];
  }
);