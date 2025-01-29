import { procedure } from "../core/chain.js";
import { buttonsGenerator, createButtons, initState, routeCallback } from "../custom/hooks.js";

export const backButtons = createButtons([
  [["Назад", 1]]
]);

export const $back = procedure();
$back.make()
  .func(initState())
  .func(async state => {
    const crum = state.data.crums[state.data.crums.length-2];
    if(crum) {
      state.data.crums.pop();
      state.data.crums.pop();
      return state.call(crum);
    }
  });

backOption(1, backButtons);

export function backOption(value: any, buttons: buttonsGenerator) {
  return routeCallback(buttons, value, $back);
}