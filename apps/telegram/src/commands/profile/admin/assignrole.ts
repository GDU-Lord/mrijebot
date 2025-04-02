import { Role } from "../../../../../core/src/entities/role.entity";
import { User } from "../../../../../core/src/entities/user.entity";
import { getUser } from "../../../api";
import { assignGlobalRole, getGlobalRoles, removeGlobalRole } from "../../../api/role";
import { CHAIN } from "../../../core/actions";
import { call } from "../../../custom/hooks/menu";
import { StateType } from "../../../custom/hooks/state";
import { CONTROL } from "../../mapping";
import { optionsField } from "../../presets/options";
import { textField } from "../../presets/textfield";
import { number } from "../../presets/validators";
import { $start } from "../../start";
import { isGlobalAdmin, isSupervisor } from "../roles";
import { removeCrum, updateGlobalRoles } from "./middleware";

export const $assignRole = textField<StateType>(
  "admin:assignRoleUserId",
  async state => {
    if(!isGlobalAdmin(state)) {
      state.call($start);
      return ["Помилка!", CHAIN.NEXT_LISTENER];
    }
    return "<u><b>Адмінська Панель: Глобальні Ролі</b></u>\n\nВведи ID користувача, якому хочеш видати роль.\n\nЙого можна знайти завантаживши таблицю в <b>Адмінська Панель > Список учасників</b>"
  },
  async (id, inp, state) => {
    if(!number()(id)) return false;
    const user = state.data.options["admin:assignRoleUser"] = await getUser(+id);
    if(!user) return false;
    return true;
  }
);

export const $assignRoleUserChosen = textField<StateType>(
  "admin:assignRoleTag",
  async state => {
    if(!isGlobalAdmin(state)) {
      state.call($start);
      return ["Помилка!", CHAIN.NEXT_LISTENER];
    }
    const roles = state.data.options["admin:globalRoles"] as Role[];
    const user = state.data.options["admin:assignRoleUser"] as User;
    const userRoleIds = user.globalRoles.map(r => r.id);
    const userRoleTags = user.globalRoles.map(r => r.tag);
    const rolesToAdd = roles.filter(r => !userRoleIds.includes(r.id)).map(r => r.tag);
    return `<u><b>Адмінська Панель: Глобальні Ролі</b></u>\n\nВведи глобальної ТЕГ ролі, щоб видати/забрати її!\n\n<b>Ролі користувача:</b>\n${userRoleTags.join("; ")}\n\n<b>Список доступних ролей:</b>\n${rolesToAdd.join("; ")}`;
  },
  async (tag, inp, state) => {
    if(!isGlobalAdmin(state)) {
      state.call($start);
      return true;
    }
    const roles = state.data.options["admin:globalRoles"] as Role[];
    const role = roles.find(r => r.tag === tag) as Role;

    if(!role) return false;
    const user = state.data.options["admin:assignRoleUser"] as User;

    const assign = !user.globalRoles.map(r => r.id).includes(role.id);

    if(assign)
      await assignGlobalRole(role.id, user.id);
    else
      await removeGlobalRole(role.id, user.id);

    await updateGlobalRoles(state);
    state.data.storage.user = await getUser(state.data.storage.user!.id);
    state.data.options["admin:assignRoleUser"] = await getUser(user.id);
    
    return false;
  }
);

$assignRole.chain.func(call($assignRoleUserChosen.proc));