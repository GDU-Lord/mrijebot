import { CHAIN } from "../../core/actions";
import { on, procedure } from "../../core/chain";
import { LocalState } from "../../core/state";
import { keyboard, buttonsGenerator, createButtons, buttonCallback } from "../../custom/hooks/buttons";
import { noRepeatCrum, addCrum } from "../../custom/hooks/menu";
import { editLast } from "../../custom/hooks/messageOptions";

export interface optionsField {
  proc: procedure;
  btn: buttonsGenerator;
  chain: on;
};

export function optionsField<LocalData = any, UserData = any>(text: (state: LocalState<LocalData, UserData>) => Promise<string>, buttons: keyboard | ((state: LocalState<LocalData, UserData>) => Promise<keyboard>), process: (state: LocalState<LocalData, UserData>, buttons: buttonsGenerator) => Promise<CHAIN | void> = async () => {}): optionsField {
  const fieldButtons = createButtons(buttons);
  const fieldProcedure = procedure();
  const fieldChain = fieldProcedure.make()
    .func(noRepeatCrum(fieldProcedure))
    .func(addCrum(fieldProcedure))
    .send(text, fieldButtons.get, editLast());
  on("callback_query", buttonCallback(data => true, fieldButtons))
    .func(async state => {
      return await process(state, fieldButtons);
    });
  return {
    proc: fieldProcedure,
    btn: fieldButtons,
    chain: fieldChain
  };
}