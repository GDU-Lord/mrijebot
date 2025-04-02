import { EditRoleDto } from "../../../../../core/src/controllers/roles/dtos/edit-role.dto";
import { Role, roleStatus, roleType } from "../../../../../core/src/entities/role.entity";
import { getUser } from "../../../api";
import { editRole, getAllRoles } from "../../../api/role";
import { CHAIN } from "../../../core/actions";
import { procedure } from "../../../core/chain";
import { createButtons } from "../../../custom/hooks/buttons";
import { addCrum, call } from "../../../custom/hooks/menu";
import { editLast } from "../../../custom/hooks/messageOptions";
import { StateType } from "../../../custom/hooks/state";
import { backButtons } from "../../back";
import { CONTROL } from "../../mapping";
import { verifyGlobalAdmin } from "../roles";

export const editRoleButtons = createButtons([
  [["Редагувати далі", CONTROL.next]],
  [["Головне меню", CONTROL.back]],
]);

export const $editRoleChosen = procedure();
$editRoleChosen.make()
  .func(verifyGlobalAdmin())
  .func(addCrum($editRoleChosen))
  .send<StateType>(async state => {
    const tag = 
      state.data.options["admin:editRoleTag"] = 
      state.core.inputs["admin:editRoleTag"]!.text ?? state.data.options["admin:editRoleTag"];
    const roles = state.data.options["admin:allRoles"] as Role[] | null;
    const role = state.data.options["admin:editRole"] = roles?.find(r => r.tag === tag);
    if(!role) {
      return ["Недійсний тег ролі, можливо його було змінено!", CHAIN.NEXT_LISTENER];
    };
    return `<u><b>Адмінська Панель</b></u>\n\nВідправ значення полів рядками у вказаному порядку:\n\nтег   <i>(alphanumeric)</i>*\nтип   <i>(local/global/hybrid)</i>*\ncтатус <i>(role/position)</i>*\nвнутрішня назва   <i>(text)</i>\nзовнішня назва   <i>(text)</i>)\nкоротка внутрішня назва <i>(text)</i>\nкоротка зовнішня назва   <i>(text)</i>\nранг <i>(number)</i>\nпосилання <i>(text)</i>\n\n"*" - зберігає поточне значення, "-" - щоб стерти поточне значення\n\n<b>Поточні значення: (скопіюй та зміни їх у своєму повідомленні)</b>\n\n<pre>${role.tag}\n${role.type}\n${role.status}\n${role.name ?? "-"}\n${role.publicName ?? "-"}\n${role.shortName ?? "-"}\n${role.shortPublicName ?? "-"}\n${role.rank ?? "-"}\n${role.link ?? "-"}</pre>`;
  }, backButtons.get, editLast())
  .input("admin:editRoleContent", true)
  .send<StateType>(async state => {
    const role = state.data.options["admin:editRole"] as Role;
    const content = state.core.inputs["admin:editRoleContent"]!.text!.split("\n");
    const data: EditRoleDto | {} = {};
    try {
      setField(role, data, "tag", content, 0);
      setField(role, data, "type", content, 1, parseEnum<roleType>("global", "hybrid", "local"));
      setField(role, data, "status", content, 2, parseEnum<roleStatus>("role", "position"));
      setField(role, data, "name", content, 3);
      setField(role, data, "publicName", content, 4);
      setField(role, data, "shortName", content, 5);
      setField(role, data, "shortPublicName", content, 6);
      setField(role, data, "rank", content, 7, parseInt);
      setField(role, data, "link", content, 8);
    } catch {
      return ["<u><b>Адмінська Панель</b></u>\n\nПоля заповнені неправильно! Спробуй знову!", CHAIN.NEXT_LISTENER];
    }
    const res = await editRole(role.id, data as EditRoleDto);
    if(!res) return ["<u><b>Адмінська Панель</b></u>\n\nПоля заповнені неправильно! Спробуй знову!", CHAIN.NEXT_LISTENER];
    state.data.storage.user = await getUser(state.data.storage.user!.id);
    // doubled crums - remove
    return "<u><b>Адмінська Панель</b></u>\n\nРоль оновлено!";
  }, editRoleButtons.get, editLast());

export const $editRole = procedure()
$editRole.make()
  .func(verifyGlobalAdmin())
  .func(addCrum($editRole))
  .send<StateType>(async state => {
    const list = state.data.options["admin:allRoles"] as Role[];
    if(!list) return ["Помилка!", CHAIN.NEXT_LISTENER];
    return "<u><b>Адмінська Панель</b></u>\n\nВведи тег ролі, яку хочеш редагувати.\n\n<b>Список ролей:</b>\n" + list.map(r => r.tag).join("; ");
  }, backButtons.get, editLast())
  .input("admin:editRoleTag", true)
  .func(call($editRoleChosen));

function setField(origin: Role, data: EditRoleDto | {}, field: keyof EditRoleDto, content: string[], index: number, parse: (v: string) => any = (v) => v) {
  let val: string | null = content[index];
  if(val === "-")
    val = ["tag", "type", "status"].includes("field") ? String(origin[field]) : null;
  else if(val === "*" || val === "" || typeof val === "undefined")
    val = String(origin[field]);
  else
    val = parse(val);
  (data as any)[field] = val;
}

function parseEnum<type = unknown>(...options: type[]) {
  return function (val: string) {
    for(const opt of options) {
      if(val === opt) return val;
    }
    throw `${val} not corresponding to type ${options.join(" | ")}!`;
  };
}