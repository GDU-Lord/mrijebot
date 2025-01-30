import { procedure } from "../core/chain.js";
import { initPromise } from "../core/index.js";
import { addCrum, createButtons, initState, menuProcedure, routeCallback } from "../custom/hooks.js";
import { backOption } from "./back.js";
import { $land } from "./land.js";

export const registerButtons = createButtons(
  [
    [["✅Подати заявку!", 1]],
    [["⬅️Назад", 2]],
  ]
);

backOption(2, registerButtons);
routeCallback(registerButtons, 1, $land);

export const $register = procedure();
menuProcedure($register)
  .send(async state => {
    if(state.data.user) {
      return `<b><u>Заявка</u></b>\n\nТи вже є у нашій системі! Якщо ти хочеш оновити свої дані або приєднатися до іншого осередку як гість, подавай заявку у зручному електронном форматі!`;
    }
    return `<b><u>Заявка</u></b>\n\nТвій акаунт ще не зареєстровано! Подавай заявку у зручному електронному форматі, щоб приєднатися до одного з наших осередків!`;
  }, registerButtons.get);