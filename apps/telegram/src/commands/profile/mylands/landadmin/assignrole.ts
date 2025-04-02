import { Role } from "../../../../../../core/src/entities/role.entity";
import { getLand, getMember, getUser } from "../../../../api";
import { assignLocalRole, removeLocalRole } from "../../../../api/role";
import { CHAIN } from "../../../../core/actions";
import { call } from "../../../../custom/hooks/menu";
import { StateType } from "../../../../custom/hooks/state";
import { textField } from "../../../presets/textfield";
import { number } from "../../../presets/validators";
import { $start } from "../../../start";
import { isLocalAdmin, isSupervisor } from "../../roles";
import { Land, Member } from "../../../../../../core/src/entities";
import { updateLocalRoles } from "./middleware";

export const $assignRole = textField<StateType>(
  "admin:assignRoleMemberId",
  async state => {
    if(!await isLocalAdmin("profile:chosenLand")(state) && !await isSupervisor(state)) {
      state.call($start);
      return ["Помилка!", CHAIN.NEXT_LISTENER];
    }
    return "<u><b>Адмінська Панель: Локальні Ролі</b></u>\n\nВведи MemberID учасника, якому хочеш видати роль.\n\nЙого можна знайти, завантаживши таблицю в <b>Панель Осередку > Список учасників</b>"
  },
  async (id, inp, state) => {
    if(!number()(id)) return false;
    const member = state.data.options["admin:assignRoleMember"] = await getMember(+id);
    const land = state.data.options["profile:chosenLand"] as Land;
    if(!member || member.landId !== land.id) return false;
    return true;
  }
);

export const $assignRoleUserChosen = textField<StateType>(
  "admin:assignRoleTag",
  async state => {
    if(!await isLocalAdmin("profile:chosenLand")(state) && !await isSupervisor(state)) {
      state.call($start);
      return ["Помилка!", CHAIN.NEXT_LISTENER];
    }
    const roles = state.data.options["admin:localRoles"] as Role[];
    const member = state.data.options["admin:assignRoleMember"] as Member;
    const memberRoleIds = member.localRoles.map(r => r.id);
    const memberRoleTags = member.localRoles.map(r => r.tag);
    const rolesToAdd = roles.filter(r => !memberRoleIds.includes(r.id)).map(r => r.tag);
    return `<u><b>Адмінська Панель: Глобальні Ролі</b></u>\n\nВведи глобальної ТЕГ ролі, щоб видати/забрати її!\n\n<b>Ролі користувача:</b>\n${memberRoleTags.join("; ")}\n\n<b>Список доступних ролей:</b>\n${rolesToAdd.join("; ")}`;
  },
  async (tag, inp, state) => {
    if(!await isLocalAdmin("profile:chosenLand")(state) && !await isSupervisor(state)) {
      state.call($start);
      return true;
    }
    const roles = state.data.options["admin:localRoles"] as Role[];
    const role = roles.find(r => r.tag === tag) as Role;
    
    if(!role) return false;
    const member = state.data.options["admin:assignRoleMember"] as Member;

    const assign = !member.localRoles.map(r => r.id).includes(role.id);

    if(assign)
      await assignLocalRole(role.id, member.id);
    else
      await removeLocalRole(role.id, member.id);

    await updateLocalRoles(state);
    state.data.storage.user = await getUser(state.data.storage.user!.id);
    state.data.options["admin:assignRoleMember"] = await getMember(member.id);
    return false;
  }
);

$assignRole.chain.func(call($assignRoleUserChosen.proc));