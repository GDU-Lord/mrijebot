import { $admin } from ".";
import { routeCallback } from "../../../custom/hooks/routes";
import { backOption } from "../../back";
import { CONTROL, MENU } from "../../mapping";
import { $start } from "../../start";
import { $editRole, $editRoleChosen, editRoleButtons } from "./editrole";
import { removeSentFile, updateRoles } from "./middleware";
import { $userList, userListButtons } from "./userlist";

export function adminRoutes() {

  backOption($admin.btn);
  routeCallback($admin.btn, MENU.option[0], $userList);
  routeCallback($admin.btn, MENU.option[1], $editRole, updateRoles);

  backOption(userListButtons, CONTROL.back, removeSentFile);
  
  routeCallback(editRoleButtons, CONTROL.back, $start);
  routeCallback(editRoleButtons, CONTROL.next, $editRoleChosen, updateRoles);

}