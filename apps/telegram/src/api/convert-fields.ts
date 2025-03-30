import { LocalState } from "../core/state";
import { StateType } from "../custom/hooks/state";

export function forAllFields(state: LocalState<StateType>, base: string, field: string, callback: (index: any, value: any) => void) {
  for(const i in state.data.options) {
    const parts = i.split(":");
    if(parts[0] === base) {
      if(parts[1] === field) {
        callback(parts[2], state.data.options[i]);
      }
    }
  }
}