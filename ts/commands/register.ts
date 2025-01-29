import { procedure } from "../core/chain.js";
import { initPromise } from "../core/index.js";
import { addCrum, createButtons, initState, menuProcedure, routeCallback } from "../custom/hooks.js";
import { backOption } from "./back.js";
import { $land } from "./land.js";

export const registerButtons = createButtons(
  [
    [["Зареєструватися", 1]],
    [["Назад", 2]],
  ]
);

backOption(2, registerButtons);
routeCallback(registerButtons, 1, $land);

export const $register = procedure();
menuProcedure($register)
  .send(`Твій акаунт ще не зареєстровано! Чи хотів би ти заповнити реєстраційну форму?`, registerButtons.get);