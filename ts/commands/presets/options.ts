import { CHAIN } from "../../core/actions.js";
import { on, procedure } from "../../core/chain.js";
import { LocalState } from "../../core/state.js";
import { keyboard, buttonsGenerator, createButtons, buttonCallback } from "../../custom/hooks/buttons.js";
import { noRepeatCrum, addCrum } from "../../custom/hooks/menu.js";
import { editLast } from "../../custom/hooks/messageOptions.js";

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