import { CHAIN } from "../../core/actions.js";
import { on, procedure } from "../../core/chain.js";
import { LocalState } from "../../core/state.js";
import { deleteLastInput } from "../../custom/hooks/inputs.js";
import { noRepeatCrum, addCrum } from "../../custom/hooks/menu.js";
import { editLast } from "../../custom/hooks/messageOptions.js";
import { backButtons } from "../back.js";

export function textField(key: string, text: (state: LocalState) => Promise<string>, validate: (value: string) => Promise<boolean> | boolean = () => true): [procedure, on] {
  const $field = procedure();
  const fields$ = $field.make()
    .func(noRepeatCrum($field))
    .func(addCrum($field))
    .send(text, backButtons.get, editLast())
    .input(key)
    .func(deleteLastInput(key))
    .func(async state => {
      if(await validate(state.core.inputs[key]?.text ?? ""))
        return CHAIN.NEXT_ACTION;
      await state.call($field);
      return CHAIN.NEXT_LISTENER;
    });
  return [$field, fields$];
}