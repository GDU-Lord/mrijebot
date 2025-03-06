import { optionsField } from "../../presets/options.js";

export const $becomeGuest = optionsField(async () => {
  return `<b><u>👤Профіль: Стати гостем осередку</u></b>\n\nОбери осередок, гостем якого ти хочеш стати:\n\n<b>Bayern</b> (Bayern)\n<b>Mitteldeutschland</b> (Thüringen, Sachsen, Sachsen-Anhalt)`;
},
async () => {
  return [
    [["Bayern", 1]],
    [["Mitteldeutschland", 2]],
    [["⬅️Назад", 0]],
  ];
});

export const $becomeGuestDone = optionsField(async () => {
  return `<b><u>👤Профіль: Стати гостем осередку</u></b>\n\nТепер ти гість осередку <b>Bayern</b> (Bayern)! \nОсь посилання на чати:`;
},
async () => {
  return [
    [["⬅️Головне меню", 0]],
  ];
});