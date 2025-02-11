import { CHAIN } from "../../core/actions.js";
import { on, procedure } from "../../core/chain.js";
import { LocalState } from "../../core/state.js";
import { addCrum, buttonCallback, buttonsGenerator, createButtons, deleteLastInput, editLast, keyboard, noRepeatCrum } from "../../custom/hooks.js";

export function optionsOtherField(key: string, text: (state: LocalState) => Promise<string>, buttons: keyboard | ((state: LocalState) => Promise<keyboard>), validate: (value: string) => Promise<boolean> | boolean = () => true, processButtons: (state: LocalState, buttons: buttonsGenerator) => Promise<CHAIN | void> = async () => {}, processInputs: (state: LocalState, inp: string) => Promise<CHAIN | void> = async () => {}): [procedure, on, buttonsGenerator] {
  const fieldButtons = createButtons(buttons);
  const $field = procedure();
  const field$ = $field.make()
    .func(noRepeatCrum($field))
    .func(addCrum($field))
    .send(text, fieldButtons.get, editLast())
    .func(async () => {
      console.log("create input");
    })
    .input(key)
    .func(deleteLastInput(key))
    .func(async state => {
      const inp = state.core.inputs[key]?.text ?? "";
      if(await validate(inp))
        await processInputs(state, inp);
      state.data.crums.pop();
      await state.call($field);
      return CHAIN.NEXT_LISTENER;
    });
  on("callback_query", buttonCallback(data => true, fieldButtons))
    .func(async state => {
      return await processButtons(state, fieldButtons);
    });
  return [$field, field$, fieldButtons];
}