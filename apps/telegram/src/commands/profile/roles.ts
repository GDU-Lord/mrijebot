import { Role } from "../../../../core/src/entities/role.entity";
import { getMember } from "../../api";
import { CHAIN } from "../../core/actions";
import { LocalState } from "../../core/state";
import { getLink } from "../../custom/hooks/links";
import { StateType } from "../../custom/hooks/state";

export async function getRoleByTag(state: LocalState<StateType>, tag: string) {
  return state.data.storage.roles.find(r => r.tag === tag);
}

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

export async function isMaster(state: LocalState<StateType>) {
  return await hasGlobalRole(state, "master");
}

export function isMasterInspector(currentLandField: string) {
  return async function (state: LocalState<StateType>) {
    return await hasLocalRole(state, "master_inspector", currentLandField);
  };
}

export function canAnnounceLocal(currentLandField: string) {
  return async function (state: LocalState<StateType>) {
    return await hasLocalRole(state, "local_announce", currentLandField);
  };
}

export type roleField = "tag" | "name" | "publicName" | "shortName" | "shortPublicName";

function sortRoles(a: Role, b: Role) {
  return (b.rank ?? 0) - (a.rank ?? 0);
}

export async function parseRoles(state: LocalState<StateType>, fields: [roleField, roleField?, roleField?, roleField?], types: "all" | "global" | "local" = "all", status: "role" | "position" | "any" = "any", onlyTop: boolean = false, landId: number | null = null) {
  const user = state.data.storage.user;
  if(!user) return ["(помилка)"];
  const roles = (types === "all" || types === "global") ? [...user.globalRoles] : [];
  if(types === "local" || types === "all") {
    for(const m of user.memberships) {
      if(landId && m.landId !== landId) continue;
      const member = await getMember(m.id);
      roles.push(...(member?.localRoles.filter(a => !roles.find(b => a.id === b.id)) ?? []));
    }
  }
  let text = roles.sort(sortRoles)
  .filter((v, i) => {
    if(status === "any") return true;
    if(v.status === status) return true;
    return false;
  })
  .filter((v, i) => {
    if(onlyTop && i !== 0) return false;
    return true;
  }).map(r => {
    let res = getLink(r[fields[0]] ?? r.tag, r.link);
    if(fields.length > 1) {
      res += " (";
      res += fields.slice(1).map(f => r[f!] ?? r.tag).join(" / ");
      res += ")";
    }
    return res;
  });
  if(text.length === 0)
    text = ["(немає)"];
  return text;
}