import { routeCallback, routeCallbackExcept, routeCallbackExceptArray } from "../../../../custom/hooks/routes";
import { backOption } from "../../../back";
import { CONTROL, MENU } from "../../../mapping";
import { removeCrum, removeSentFile } from "../../admin/middleware";
import { $landPanel } from "../landlist";
import { $annouceText, $announcementDone } from "./announce";
import { $assignRole } from "./assignrole";
import { $memberList, memberListButtons } from "./memberlist";
import { processRequestAction, updateLocalRoles } from "./middleware";
import { $localRequest, $localRequests } from "./requests";

export function landAdminRoutes() {

  routeCallback($landPanel.btn, MENU.option[10], $memberList);
  routeCallback($landPanel.btn, MENU.option[11], $assignRole.proc, updateLocalRoles);
  routeCallback($landPanel.btn, MENU.option[40], $localRequests.proc);
  routeCallback($landPanel.btn, MENU.option[50], $annouceText.proc);

  backOption($localRequests.btn);
  routeCallbackExceptArray($localRequests.btn, [CONTROL.back], $localRequest.proc);

  backOption($localRequest.btn);
  backOption($localRequest.btn, CONTROL.clear, processRequestAction);
  backOption($localRequest.btn, CONTROL.next, processRequestAction);

  backOption(memberListButtons, CONTROL.back, removeSentFile);

  backOption($announcementDone.btn, CONTROL.back, removeCrum);

}