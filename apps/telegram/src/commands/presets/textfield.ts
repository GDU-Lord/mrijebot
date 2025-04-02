import TelegramBot from "node-telegram-bot-api";
import { CHAIN } from "../../core/actions";
import { on, procedure } from "../../core/chain";
import { LocalState } from "../../core/state";
import { deleteLastInput } from "../../custom/hooks/inputs";
import { noRepeatCrum, addCrum } from "../../custom/hooks/menu";
import { editLast } from "../../custom/hooks/messageOptions";
import { backButtons } from "../back";

export interface textField {
  proc: procedure;
  chain: on;
}

export function textField<LocalData = any, UserData = any>(key: string, text: (state: LocalState<LocalData, UserData>) => Promise<string | [string, CHAIN]>, validate: (value: string, message: TelegramBot.Message, state: LocalState<LocalData, UserData>) => Promise<boolean> | boolean = () => true): textField {
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
      if(await validate(text, inp, state))
        return CHAIN.NEXT_ACTION;
      state.call(fieldProcedure);
      return CHAIN.NEXT_LISTENER;
    });
  return {
    proc: fieldProcedure,
    chain: fieldChain,
  }
}