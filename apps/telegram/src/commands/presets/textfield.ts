import TelegramBot from "node-telegram-bot-api";
import { CHAIN } from "../../core/actions.js";
import { on, procedure } from "../../core/chain.js";
import { LocalState } from "../../core/state.js";
import { deleteLastInput } from "../../custom/hooks/inputs.js";
import { noRepeatCrum, addCrum } from "../../custom/hooks/menu.js";
import { editLast } from "../../custom/hooks/messageOptions.js";
import { backButtons } from "../back.js";

export interface textField {
  proc: procedure;
  chain: on;
}

export function textField<LocalData = any, UserData = any>(key: string, text: (state: LocalState<LocalData, UserData>) => Promise<string>, validate: (value: string, message: TelegramBot.Message) => Promise<boolean> | boolean = () => true): textField {
  const fieldProcedure = procedure();
  const fieldChain = fieldProcedure.make()
    .func(noRepeatCrum(fieldProcedure))
    .func(addCrum(fieldProcedure))
    .send(text, backButtons.get, editLast())
    .input(key)
    .func(deleteLastInput(key))
    .func(async state => {
      const inp = state.core.inputs[key]!;
      const text = inp.text ?? "";
      if(await validate(text, inp))
        return CHAIN.NEXT_ACTION;
      await state.call(fieldProcedure);
      return CHAIN.NEXT_LISTENER;
    });
  return {
    proc: fieldProcedure,
    chain: fieldChain,
  }
}