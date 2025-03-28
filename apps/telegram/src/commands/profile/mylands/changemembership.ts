import { StateType } from "../../../custom/hooks/state";
import { CONTROL } from "../../mapping";
import { optionsField } from "../../presets/options";

export const $changeMembership = optionsField<StateType>(
  async state => {
    // add the list of lands
    return `<b><u>👤Профіль: Зміна осередку</u></b>\n\n❗Зауваж, що запит на зміну свого осередку реєстрації — це незворотня дія.\n❗Твій запит буде передано Координаційному Органу новообраного осередку.\n❗Дію твого акаунту в системі Мрієтворців буде призупинено до підтвердження або відхилення цього запиту!\n\nЯкщо ти ДІЙСНО хочеш продовжити, обери відповідний осередок зі списку:`;
  },
  async state => {
    return [
      [["Berlin", 1]],
      [["Bayern", 2]],
      [["Mittledeutschland", 3]],
      [["Niedersachsen", 4]],
      [["Mecklenburg-Vorpommen", 5]],
      [["⬅️Назад", CONTROL.back]]
    ]
  }
);

export const $landChangeProceed = optionsField<StateType>(
  async state => {
    return `<b><u>👤Профіль: Зміна осередку</u></b>\n\n❗Ти дійсно хочеш зробити запит на зміну осередку реєстрації? Тобою обрано осередок "Berlin" (Berlin, Brandenburg)`;
  },
  async state => {
    return [
      [["❗Продовжити", CONTROL.next]],
      [["❌Скасувати", CONTROL.back]]
    ]
  }
);

export const $landChanged = optionsField<StateType>(
  async state => {
    return `<b><u>👤Профіль: Зміна осередку</u></b>\n\n❗Запит на зміну осередку відправлено! Дію твого акаунту тимчасово призупинено. За потреби ти все ще можеш зв'язатися нашою командою!`;
  },
  [
    [["⬅️Головне меню", CONTROL.back]],
  ]
);