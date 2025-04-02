import { Role } from "../../../../core/src/entities/role.entity";
import { getMember } from "../../api";
import { LocalState } from "../../core/state";
import { getLink } from "../../custom/hooks/links";
import { StateType } from "../../custom/hooks/state";

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