import { procedure } from "../core/chain.js";
import { initPromise } from "../core/index.js";
import { addCrum, initState, menuProcedure } from "../custom/hooks.js";
import { backButtons } from "./back.js";

export const $info = procedure();
menuProcedure($info)
  .send(`Тут буде всяка інформація...`, backButtons.get);