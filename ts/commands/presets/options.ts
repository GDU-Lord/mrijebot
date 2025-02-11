import { CHAIN } from "../../core/actions.js";
import { on, procedure } from "../../core/chain.js";
import { LocalState } from "../../core/state.js";
import { addCrum, buttonCallback, buttonCallbackArray, buttonsGenerator, createButtons, editLast, keyboard, noRepeatCrum } from "../../custom/hooks.js";

export function optionsField(text: (state: LocalState) => Promise<string>, buttons: keyboard | ((state: LocalState) => Promise<keyboard>), process: (state: LocalState, buttons: buttonsGenerator) => Promise<CHAIN | void> = async () => {}): [procedure, on, buttonsGenerator] {
  const fieldButtons = createButtons(buttons);
  const $field = procedure();
  const field$ = $field.make()
    .func(noRepeatCrum($field))
    .func(addCrum($field))
    .send(text, fieldButtons.get, editLast());
  on("callback_query", buttonCallback(data => true, fieldButtons))
    .func(async state => {
      return await process(state, fieldButtons);
    });
  return [$field, field$, fieldButtons];
}