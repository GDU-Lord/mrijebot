import { routeCallback, routeCallbackArray, routeCallbackExcept, routeCallbackExceptArray, waitFor } from "../../custom/hooks/routes";
import { $back, backOption } from "../back";
import { CONTROL, MENU } from "../mapping";
import { $start } from "../start";
import { $admin } from "./admin";
import { $myAnnouncements } from "./announcements";
import { $annouceEditInput, $announcement, $announcementEdit, $announcementMeta } from "./announcements/announcement";
import { getAnnouncement, nextPage, prevPage } from "./announcements/middleware";
import { $idCard } from "./idcard";
import { $main } from "./index";
import { $becomeMaster } from "./master/becomemaster";
import { $masterPanel } from "./master/index";
import { $becomeGuest, $becomeGuestDone } from "./mylands/becomeguest";
import { $changeMembership, $landChangeProceed, $landChanged } from "./mylands/changemembership";
import { $myLands } from "./mylands/index";
import { $announcementDone } from "./mylands/landadmin/announce";
import { $myLandsList, $landPanel, $leaveLand, $landLeft } from "./mylands/landlist";
import { $playerPanel } from "./player/index";

export function profileRoutes () {

  backOption($main.btn);
  routeCallback($main.btn, MENU.option[0], $myLands.proc);
  routeCallback($main.btn, MENU.option[2], $playerPanel.proc);
  routeCallback($main.btn, MENU.option[3], $masterPanel.proc);
  routeCallback($main.btn, MENU.option[4], $myAnnouncements.proc);
  routeCallback($main.btn, MENU.option[5], $idCard.proc);
  routeCallback($main.btn, MENU.option[6], $admin.proc);
  routeCallback($main.btn, MENU.option[7], $becomeMaster.proc);

  backOption($idCard.btn);

  backOption($myLands.btn);
  routeCallback($myLands.btn, MENU.option[0], $myLandsList.proc);
  routeCallback($myLands.btn, MENU.option[1], $changeMembership.proc);
  routeCallback($myLands.btn, MENU.option[2], $becomeGuest.proc);

  backOption($myLandsList.btn);
  routeCallbackExcept($myLandsList.btn, CONTROL.back, $landPanel.proc);

  backOption($landPanel.btn);
  routeCallback($landPanel.btn, MENU.option[0], $leaveLand.proc);
  routeCallback($landPanel.btn, MENU.option[1], $changeMembership.proc);

  backOption($leaveLand.btn);
  routeCallback($leaveLand.btn, CONTROL.next, $landLeft.proc, waitFor($leaveLand.proc));

  routeCallback($landLeft.btn, CONTROL.back, $start);

  backOption($changeMembership.btn);
  routeCallbackExcept($changeMembership.btn, CONTROL.back, $landChangeProceed.proc);

  backOption($landChangeProceed.btn);
  routeCallback($landChangeProceed.btn, CONTROL.next, $landChanged.proc);

  routeCallback($landChanged.btn, CONTROL.back, $start);

  backOption($becomeGuest.btn);
  routeCallbackExcept($becomeGuest.btn, CONTROL.back, $becomeGuestDone.proc, waitFor($becomeGuest.proc));

  routeCallback($becomeGuestDone.btn, CONTROL.back, $start);

  backOption($myAnnouncements.btn);
  routeCallback($myAnnouncements.btn, MENU.option[0], $myAnnouncements.proc, prevPage);
  routeCallback($myAnnouncements.btn, MENU.option[1], $myAnnouncements.proc, nextPage);
  routeCallbackExceptArray($myAnnouncements.btn, [MENU.option[0], MENU.option[1], CONTROL.back], $announcement.proc, getAnnouncement);

  backOption($announcement.btn);
  routeCallback($announcement.btn, MENU.option[0], $announcementMeta.proc);
  routeCallback($announcement.btn, MENU.option[1], $annouceEditInput.proc);

  backOption($announcementMeta.btn);
  backOption($announcementEdit.btn);

}