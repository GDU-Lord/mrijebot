import { procedure } from "../core/chain.js";
import { createButtons, keyboard, menuProcedure, routeCallback } from "../custom/hooks.js";
import { backOption } from "./back.js";
import { $form } from "./form.js";
import { lands } from "./land.js";

export const landInfoButtons = createButtons(async state => {
  const buttons: keyboard = [];
  if(state.data.user) {
    if(state.data.user[5] === lands[state.data.land as keyof typeof lands][0] && state.data.user[6] !== "Я проживаю за межами цієї землі і хочу приєднатися як гість")
      buttons.push([["✅Оновити дані", 2]]);
    else {
      buttons.push([["👋Приєднатися як Гість", 1]]);
      buttons.push([["⚠️Змінити осередок!", 0]]);
    }
  }
  else
    buttons.push([["✅Стати Учасником", 3]]);
  buttons.push([["⬅️Назад", 4]]);
  return buttons;
});

backOption(4, landInfoButtons);
routeCallback(landInfoButtons, 0, $form);
routeCallback(landInfoButtons, 1, $form);
routeCallback(landInfoButtons, 2, $form);
routeCallback(landInfoButtons, 3, $form);

export const $landInfo = procedure();
menuProcedure($landInfo)
  .send("Тут інформація про землю {data.land}", landInfoButtons.get);