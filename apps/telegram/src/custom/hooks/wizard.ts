import { CHAIN } from "../../core/actions";
import { LocalState } from "../../core/state";
import { StateType } from "./state";

export function isWizard() {
  return async (state: LocalState<StateType>) => {
    return;
    if(!state.data.storage.isWizard) return CHAIN.EXIT;
  }
}