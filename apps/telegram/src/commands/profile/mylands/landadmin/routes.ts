import { routeCallback, routeCallbackExcept, routeCallbackExceptArray } from "../../../../custom/hooks/routes";
import { backOption } from "../../../back";
import { CONTROL, MENU } from "../../../mapping";
import { removeSentFile } from "../../admin/middleware";
import { $landPanel } from "../landlist";
import { $assignRole } from "./assignrole";
import { $memberList, memberListButtons } from "./memberlist";
import { processRequestAction, updateLocalRoles } from "./middleware";
import { $localRequest, $localRequests } from "./requests";

export function landAdminRoutes() {

  routeCallback($landPanel.btn, MENU.option[10], $memberList);
  routeCallback($landPanel.btn, MENU.option[11], $assignRole.proc, updateLocalRoles);
  routeCallback($landPanel.btn, MENU.option[40], $localRequests.proc);

  backOption($localRequests.btn);
  routeCallbackExceptArray($localRequests.btn, [CONTROL.back], $localRequest.proc);

  backOption($localRequest.btn);
  backOption($localRequest.btn, CONTROL.clear, processRequestAction);
  backOption($localRequest.btn, CONTROL.next, processRequestAction);

  backOption(memberListButtons, CONTROL.back, removeSentFile);

}