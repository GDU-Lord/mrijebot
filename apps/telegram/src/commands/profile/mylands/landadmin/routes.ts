import { routeCallback } from "../../../../custom/hooks/routes";
import { backOption } from "../../../back";
import { CONTROL, MENU } from "../../../mapping";
import { removeSentFile } from "../../admin/middleware";
import { $landPanel } from "../landlist";
import { $assignRole } from "./assignrole";
import { $memberList, memberListButtons } from "./memberlist";
import { updateLocalRoles } from "./middleware";

export function landAdminRoutes() {

  routeCallback($landPanel.btn, MENU.option[10], $memberList);
  routeCallback($landPanel.btn, MENU.option[11], $assignRole.proc, updateLocalRoles);

  backOption(memberListButtons, CONTROL.back, removeSentFile);

}