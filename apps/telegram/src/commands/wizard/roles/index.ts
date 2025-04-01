import { trimCommand } from "..";
import { Role, roleStatus, roleType } from "../../../../../core/src/entities/role.entity";
import { createSystem } from "../../../api";
import { assignGlobalRole, createRole, getGlobalRoles } from "../../../api/role";
import { CHAIN } from "../../../core/actions";
import { procedure } from "../../../core/chain";
import { deleteLastInput, deleteLastMessage } from "../../../custom/hooks/inputs";
import { editLast } from "../../../custom/hooks/messageOptions";
import { StateType } from "../../../custom/hooks/state";
import { isWizard } from "../../../custom/hooks/wizard";
import { wizardButtons } from "../routes";

export const $createRole = procedure();
$createRole.make()
  .func(deleteLastMessage())
  .func(isWizard())
  .send("Обери cтатус ролі!\n\n/role - звичайна роль\n\n/position - cтатус", wizardButtons.get, editLast())
  
  .input("wizard:newRoleStatus", true)
  .send(async state => {
    const status = state.core.inputs["wizard:newRoleStatus"]?.text as roleStatus;
    
    if(!["/role", "/position"].includes(status)) 
      return ["Помилка!", CHAIN.NEXT_LISTENER];
    
    return "Обери вид ролі!\n\n/local - роль в осередку\n\n/global - глобальна роль\n\n/hybrid - гібридна";
  }, wizardButtons.get, editLast())

  .input("wizard:newRoleType", true)
  .send(async state => {
    const type = state.core.inputs["wizard:newRoleType"]?.text as roleType;
    
    if(!["/local", "/global", "/hybrid"].includes(type)) 
      return ["Помилка!", CHAIN.NEXT_LISTENER];
    
    return "Введи ТЕГ нової ролі! (лише літери, цифри та нижні підкреслення)";
  }, wizardButtons.get, editLast())

  .input("wizard:newRoleTag", true)
  .send<StateType>(async state => {
    const tag = state.core.inputs["wizard:newRoleTag"]?.text;

    if(!tag || !tag.match(/^[a-zA-Z0-9_]*$/)) return ["Неправильний формат тегу!", CHAIN.NEXT_LISTENER];

    const type = trimCommand(state.core.inputs["wizard:newRoleType"]?.text ?? "") as roleType;
    const status = trimCommand(state.core.inputs["wizard:newRoleStatus"]?.text ?? "") as roleStatus;

    const res = await createRole(tag, type, status);
    if(!res) return ["Помилка!", CHAIN.NEXT_LISTENER];

    return "Роль додано!";
  }, wizardButtons.get, editLast());

export const $getRole = procedure();
$getRole.make()
  .func(deleteLastMessage())
  .func(isWizard())
  .send<StateType>(async state => {
    const roles = state.data.options["wizard:roles"] = await getGlobalRoles() ?? [];
    return "Введи тег глобальної ролі!\n\nСписок ролей: " + roles.map(r => r.tag).join("; ");
  }, wizardButtons.get, editLast())
  .input("wizard:getRoleTag", true)
  .send<StateType>(async state => {
    const tag = state.core.inputs["wizard:getRoleTag"]?.text ?? "";
    const roles = state.data.options["wizard:roles"] as Role[];
    const role = roles.find(r => r.tag === tag);
    const user = state.data.storage.user;
    if(!role) return ["Роль не знайдено!", CHAIN.NEXT_LISTENER];
    if(!user) return ["Зайди спершу в акаунт (ГОЛОВНЕ МЕНЮ)!", CHAIN.NEXT_LISTENER];
    const res = await assignGlobalRole(role.id, user.id);
    if(!res) return ["Помилка!", CHAIN.NEXT_LISTENER];
    return "Роль отримано!";
  }, wizardButtons.get, editLast());