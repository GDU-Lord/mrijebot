import { optionsField } from "../../presets/options";

export const $becomeGuest = optionsField(
  async state => {
    return `<b><u>👤Профіль: Стати гостем осередку</u></b>\n\nОбери осередок, гостем якого ти хочеш стати:\n\n<b>Bayern</b> (Bayern)\n<b>Mitteldeutschland</b> (Thüringen, Sachsen, Sachsen-Anhalt)`;
  },
  async state => {
    return [
      [["Bayern", 1]],
      [["Mitteldeutschland", 2]],
      [["⬅️Назад", 0]],
    ];
  }
);

export const $becomeGuestDone = optionsField(
  async state => {
    return `<b><u>👤Профіль: Стати гостем осередку</u></b>\n\nТепер ти гість осередку <b>Bayern</b> (Bayern)! \nОсь посилання на чати:`;
  },
  async state => {
    return [
      [["⬅️Головне меню", 0]],
    ];
  }
);