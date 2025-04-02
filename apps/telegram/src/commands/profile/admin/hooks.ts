import { Member } from "../../../../../core/src/entities";
import { getMember } from "../../../api";
import { CHAIN } from "../../../core/actions";
import { LocalState } from "../../../core/state";
import { StateType } from "../../../custom/hooks/state";

export function verifyGlobalAdmin() {
  return async function (state: LocalState<StateType>) {
    if(!await isGlobalAdmin(state)) return CHAIN.NEXT_LISTENER;
  };
}

export function verifyEitherRole(...roles: ((state: LocalState<StateType>) => Promise<boolean> | boolean)[]) {
  return async function (state: LocalState<StateType>) {
    for(const role of roles) {
      try {
        if(await role(state)) return CHAIN.NEXT_ACTION;
      } catch {
        return CHAIN.NEXT_LISTENER;
      }
    }
    return CHAIN.NEXT_LISTENER;
  }
}

export async function hasGlobalRole(state: LocalState<StateType>, tag: string) {
  return state.data.storage.user?.globalRoles.map(r => r.tag).includes(tag) ?? false;
}

export async function hasLocalRole(state: LocalState<StateType>, tag: string, currentLandField: string) {
  const user = state.data.storage.user;
  const landId = state.data.options[currentLandField]?.id;
  const memberId = user?.memberships.find(m => m.landId === landId)?.id;
  if(!memberId) return false;
  const member = await getMember(memberId);
  return member?.localRoles.map(r => r.tag).includes(tag) ?? false;
}

export async function isGlobalAdmin(state: LocalState<StateType>) {
  return await hasGlobalRole(state, "global_admin");
}

export async function isSupervisor(state: LocalState<StateType>) {
  return await hasGlobalRole(state, "supervisor");
}

export function isLocalAdmin(currentLandField: string) {
  return async function (state: LocalState<StateType>) {
    return await hasLocalRole(state, "local_admin", currentLandField);
  };
}