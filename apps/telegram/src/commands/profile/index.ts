import { afterInit } from "../../afterInit.js";
import { StateType } from "../../custom/hooks/state.js";
import { optionsField } from "../presets/options.js";
import { profileRoutes } from "./routes.js";

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
      [["📍Мої осередки", 1], ["📧Контактні дані", 2]],
      [["💙Панель гравця", 3], ["💛Панель майстра", 4]],
      [["⚙️Налаштування оголошень", 5]],
      [["💳Ідентифікаційна Картка", 6]],
      [["⬅️Назад", 0]],
    ];
  }
);