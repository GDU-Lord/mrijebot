import { CHAIN } from "../../../core/actions";
import { LocalState } from "../../../core/state";
import { StateType } from "../../../custom/hooks/state";

export function verifyGlobalAdmin() {
  return async function (state: LocalState<StateType>) {
    if(!isGlobalAdmin) return CHAIN.NEXT_LISTENER;
  }
}

export function isGlobalAdmin(state: LocalState<StateType>) {
  return state.data.storage.user?.globalRoles.map(r => r.tag).includes("global_admin");
}