import { $admin } from ".";
import { routeCallback } from "../../../custom/hooks/routes";
import { backOption } from "../../back";
import { CONTROL, MENU } from "../../mapping";
import { $start } from "../../start";
import { $assignRole } from "./assignrole";
import { $editRole, $editRoleChosen, editRoleButtons } from "./editrole";
import { removeCrum, removeSentFile, updateGlobalRoles, updateRoles } from "./middleware";
import { $userList, userListButtons } from "./userlist";

export function adminRoutes() {

  backOption($admin.btn);
  routeCallback($admin.btn, MENU.option[0], $userList);
  routeCallback($admin.btn, MENU.option[1], $editRole, updateRoles);
  routeCallback($admin.btn, MENU.option[2], $assignRole.proc, updateGlobalRoles);

  backOption(userListButtons, CONTROL.back, removeSentFile);
  
  routeCallback(editRoleButtons, CONTROL.back, $start);
  routeCallback(editRoleButtons, CONTROL.next, $editRoleChosen, updateRoles, removeCrum);

  // backOption($roleAssigned.btn, CONTROL.back, removeCrum, removeCrum);

}