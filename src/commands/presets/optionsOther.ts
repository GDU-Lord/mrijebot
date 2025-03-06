import TelegramBot from "node-telegram-bot-api";
import { CHAIN } from "../../core/actions.js";
import { on, procedure } from "../../core/chain.js";
import { LocalState } from "../../core/state.js";
import { buttonCallback, buttonsGenerator, createButtons, keyboard } from "../../custom/hooks/buttons.js";
import { deleteLastInput } from "../../custom/hooks/inputs.js";
import { noRepeatCrum, addCrum } from "../../custom/hooks/menu.js";
import { editLast } from "../../custom/hooks/messageOptions.js";
import { optionsField } from "./options.js";

export function optionsOtherField<LocalData = any, UserData = any>(key: string, text: (state: LocalState<LocalData, UserData>) => Promise<string>, buttons: keyboard | ((state: LocalState<LocalData, UserData>) => Promise<keyboard>), validate: (value: string, message: TelegramBot.Message) => Promise<boolean> | boolean = () => true, processButtons: (state: LocalState<LocalData, UserData>, buttons: buttonsGenerator) => Promise<CHAIN | void> = async () => {}, processInputs: (state: LocalState<LocalData, UserData>, inp: string, message: TelegramBot.Message) => Promise<CHAIN | void> = async () => {}): optionsField {
  const fieldButtons = createButtons(buttons);
  const fieldProcedure = procedure();
  const fieldChain = fieldProcedure.make()
    .func(noRepeatCrum(fieldProcedure))
    .func(addCrum(fieldProcedure))
    .send(text, fieldButtons.get, editLast())
    .input(key)
    .func(deleteLastInput(key))
    .func(async state => {
      const inp = state.core.inputs[key]!;
      const text = inp?.text ?? "";
      if(await validate(text, inp))
        await processInputs(state, text, inp);
      state.data.crums.pop();
      await state.call(fieldProcedure);
      return CHAIN.NEXT_LISTENER;
    });
  on("callback_query", buttonCallback(data => true, fieldButtons))
    .func(async state => {
      return await processButtons(state, fieldButtons);
    });
  return {
    proc: fieldProcedure,
    btn: fieldButtons,
    chain: fieldChain,
  };
}