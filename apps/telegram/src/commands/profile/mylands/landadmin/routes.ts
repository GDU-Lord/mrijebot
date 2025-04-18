import { routeCallback, routeCallbackExcept, routeCallbackExceptArray } from "../../../../custom/hooks/routes";
import { backOption } from "../../../back";
import { CONTROL, MENU } from "../../../mapping";
import { removeCrum, removeSentFile } from "../../admin/middleware";
import { $landPanel } from "../landlist";
import { $annouceText, $announcementDone } from "./announce";
import { $localAnnouceEditInput, $localAnnouncement, $localAnnouncementArchive, $localAnnouncementArchived, $localAnnouncementEdit, $localAnnouncementMeta, $localAnnouncements } from "./announcements";
import { $assignRole } from "./assignrole";
import { $memberList, memberListButtons } from "./memberlist";
import { getAnnouncement, nextPage, prevPage, processRequestAction, updateLocalRoles } from "./middleware";
import { $localRequest, $localRequests } from "./requests";

export function landAdminRoutes() {

  routeCallback($landPanel.btn, MENU.option[10], $memberList);
  routeCallback($landPanel.btn, MENU.option[11], $assignRole.proc, updateLocalRoles);
  routeCallback($landPanel.btn, MENU.option[40], $localRequests.proc);
  routeCallback($landPanel.btn, MENU.option[50], $annouceText.proc);
  routeCallback($landPanel.btn, MENU.option[60], $localAnnouncements.proc);

  backOption($localRequests.btn);
  routeCallbackExceptArray($localRequests.btn, [CONTROL.back], $localRequest.proc);

  backOption($localRequest.btn);
  backOption($localRequest.btn, CONTROL.clear, processRequestAction);
  backOption($localRequest.btn, CONTROL.next, processRequestAction);

  backOption(memberListButtons, CONTROL.back, removeSentFile);

  backOption($announcementDone.btn, CONTROL.back, removeCrum);

  backOption($localAnnouncements.btn);
    routeCallback($localAnnouncements.btn, MENU.option[0], $localAnnouncements.proc, prevPage);
    routeCallback($localAnnouncements.btn, MENU.option[1], $localAnnouncements.proc, nextPage);
    routeCallbackExceptArray($localAnnouncements.btn, [MENU.option[0], MENU.option[1], CONTROL.back], $localAnnouncement.proc, getAnnouncement);
  
    backOption($localAnnouncement.btn);
    routeCallback($localAnnouncement.btn, MENU.option[0], $localAnnouncementMeta.proc);
    routeCallback($localAnnouncement.btn, MENU.option[1], $localAnnouceEditInput.proc);
  
    backOption($localAnnouncementMeta.btn);
    routeCallback($localAnnouncementMeta.btn, CONTROL.clear, $localAnnouncementArchive.proc);
  
    backOption($localAnnouncementArchive.btn);
    routeCallback($localAnnouncementArchive.btn, CONTROL.next, $localAnnouncementArchived.proc);
  
    backOption($localAnnouncementArchived.btn);
    backOption($localAnnouncementArchived.btn, CONTROL.next);
  
    backOption($localAnnouncementEdit.btn);

}