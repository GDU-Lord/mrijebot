import { on, procedure } from "../core/chain.js";
import { buttonCallback, createButtons, getLastCallback, initState, menuProcedure, routeCallback } from "../custom/hooks.js";
import { backOption } from "./back.js";
import { $landInfo } from "./landinfo.js"

export const lands: {
  [key: string]: [
    string,
    {
      [key: string]: string
    }
  ]
} = {
  'berlin': [
    "Berlin, Brandenburg",
    {
      "Чат 11": "https://t.me/+0DEqgmUU7f41OTNi",
      "Чат 12": "https://t.me/+0DEqgmUU7f41OTNi",
      "Чат 13": "https://t.me/+0DEqgmUU7f41OTNi",
    }
  ],
  'mitteldeutschland': [
    "Sachsen-Anhalt, Thüringen, Sachsen",
    {
      "Чат 21": "https://t.me/+0DEqgmUU7f41OTNi",
      "Чат 22": "https://t.me/+0DEqgmUU7f41OTNi",
      "Чат 23": "https://t.me/+0DEqgmUU7f41OTNi",
    }
  ],
  'bayern': [
    "Bayern",
    {
      "Чат 31": "https://t.me/+0DEqgmUU7f41OTNi",
      "Чат 32": "https://t.me/+0DEqgmUU7f41OTNi",
      "Чат 33": "https://t.me/+0DEqgmUU7f41OTNi",
    }
  ],
  'niedersachsen': [
    "Bremen, Niedersachsen, Hamburg",
    {
      "Чат 41": "https://t.me/+0DEqgmUU7f41OTNi",
      "Чат 42": "https://t.me/+0DEqgmUU7f41OTNi",
      "Чат 43": "https://t.me/+0DEqgmUU7f41OTNi",
    }
  ],
};

export const landButtons = createButtons([
  [["📌Berlin", 'berlin']],
  [["📌Mitteldeutschland", 'mitteldeutschland']],
  [["📌Bayern", 'bayern']],
  [["📌Niedersachsen", 'niedersachsen']],
  [["⬅️Назад", 1]],
]);

backOption(1, landButtons);
on("callback_query", buttonCallback(data => data !== 1, landButtons))
  .func(initState())
  .func(async state => {
    state.data.land = getLastCallback(state, landButtons);
    await state.call($landInfo);
  });

// Berlin, Brandenburg
// Sachsen-Anhalt, Thüringen, Sachsen
// Bremen, Niedersachsen, Hamburg
// Bayern

export const $land = procedure();
menuProcedure($land)
  .send(async state => {
    const type = state.data.user ? "на оновлення даних Учасника або приєднання в якості Гостя" : "на приєднання у ролі Учаника";
    return `<b><u>Заявка</u></b>\n\nОбери осередок Мрієтворців, у який ти хочеш подати заявку ${type}!\n\n<b><u>Межі осередків:</u></b>\n\n📌<b>Berlin</b>:\nBerlin, земля Brandenburg\n\n📌<b>Mitteldeutschland</b>:\nземлі Sachsen-Anhalt, Thüringen, Sachsen\n\n📌<b>Niedersachsen</b>:\nBremen, Hamburg, земля Niedersachsen\n\n📌<b>Bayern</b>:\nземля Bayern`;
  }, landButtons.get);
