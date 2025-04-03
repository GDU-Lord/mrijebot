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

export function optionsField<LocalData = any, UserData = any>(text: (state: LocalState<LocalData, UserData>) => Promise<string | [string, CHAIN]>, buttons: keyboard | ((state: LocalState<LocalData, UserData>) => Promise<keyboard>), process: (state: LocalState<LocalData, UserData>, buttons: buttonsGenerator) => Promise<CHAIN | void> = async () => {}): optionsField {
  const fieldButtons = createButtons(buttons);
  const fieldProcedure = procedure();
  const fieldChain = fieldProcedure.make()
    .func(noRepeatCrum(fieldProcedure))
    .func(addCrum(fieldProcedure))
    .send(text, fieldButtons.get, editLast())
    .func(async state => {
      const pname = fieldProcedure.id;
      state.core.promises.promise[pname] = new Promise<any>((res, rej) => {
        state.core.promises.resolve[pname] = res;
      });
    });
  on("callback_query", buttonCallback(data => true, fieldButtons))
    .func(async state => {
      const res = await process(state, fieldButtons);
      const pname = fieldProcedure.id;
      state.core.promises.resolve[pname]?.(res);
      delete state.core.promises.resolve[pname];
      return res;
    });
  return {
    proc: fieldProcedure,
    btn: fieldButtons,
    chain: fieldChain
  };
}