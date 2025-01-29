import { procedure } from "../core/chain.js";
import { createButtons, menuProcedure, routeCallback } from "../custom/hooks.js";
import { backOption } from "./back.js";
import { $form } from "./form.js";

export const landInfoButtons = createButtons([
  [["Стати Учасником", 1]],
  [["Назад", 2]],
]);

backOption(2, landInfoButtons);
routeCallback(landInfoButtons, 1, $form);

export const $landInfo = procedure();
menuProcedure($landInfo)
  .send("Тут інформація про землю {data.land}", landInfoButtons.get);