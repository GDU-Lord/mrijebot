import { procedure } from "../core/chain.js";
import { menuProcedure } from "../custom/hooks.js";
import { backButtons } from "./back.js";

export const $form = procedure();
menuProcedure($form)
  // add the user to the queue for checking the sheet and daily reminders
  // generate a pre-filled link
  .send("Заповни форму за посиланням, щоб отримати доступ до групи в землі {data.land}", backButtons.get);