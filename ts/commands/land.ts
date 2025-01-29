import TelegramBot from "node-telegram-bot-api";
import { on, procedure } from "../core/chain.js";
import { buttonCallback, createButtons, getLastCallback, initState, menuProcedure, routeCallback } from "../custom/hooks.js";
import { backOption } from "./back.js";
import { $landInfo } from "./landinfo.js"

export const landButtons = createButtons([
  [["Berlin", 'berlin']],
  [["Mitteldeutschland", 'mitteldeutschland']],
  [["Bayern", 'bayern']],
  [["Niedersachsen", 'niedersachsen']],
  [["Назад", 1]],
]);

backOption(1, landButtons);
on("callback_query", buttonCallback(data => data !== 1, landButtons))
  .func(initState())
  .func(async state => {
    state.data.land = getLastCallback(state, landButtons);
    await state.call($landInfo);
  });

export const $land = procedure();
menuProcedure($land)
  .send(`Обери свій регіон!`, landButtons.get);
