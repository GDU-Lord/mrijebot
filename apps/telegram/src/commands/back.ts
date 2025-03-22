import { procedure } from "../core/chain";
import { createButtons, buttonsGenerator } from "../custom/hooks/buttons";
import { routeCallback } from "../custom/hooks/routes";
import { initState } from "../custom/hooks/state";

export const backButtons = createButtons([
  [["⬅️Назад", 1]]
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