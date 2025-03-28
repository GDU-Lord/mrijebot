import { routeCallback, routeCallbackArray, routeCallbackExcept } from "../../custom/hooks/routes";
import { $back, backOption } from "../back";
import { CONTROL, MENU } from "../mapping";
import { $start } from "../start";
import { $idCard } from "./idcard";
import { $main } from "./index";
import { $masterPanel } from "./master/index";
import { $becomeGuest, $becomeGuestDone } from "./mylands/becomeguest";
import { $changeMembership, $landChangeProceed, $landChanged } from "./mylands/changemembership";
import { $myLands } from "./mylands/index";
import { $myLandsList, $landPanel, $leaveLand, $landLeft } from "./mylands/landlist";
import { $playerPanel } from "./player/index";
import { $experience, $gamesPlayed, $systemsPlayed } from "./player/systemsandxp";
import { $myTriggers, $prefExplore, $prefferences, $prefFight, $prefSocial, $systemsPreferred, $textForMaster } from "./player/triggersandprefs";

export function profileRoutes () {

  backOption($main.btn);
  routeCallback($main.btn, MENU.option[0], $myLands.proc);
  routeCallback($main.btn, MENU.option[2], $playerPanel.proc);
  routeCallback($main.btn, MENU.option[3], $masterPanel.proc);
  routeCallback($main.btn, MENU.option[5], $idCard.proc);

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
  routeCallback($leaveLand.btn, CONTROL.next, $landLeft.proc, $leaveLand.proc.id);

  routeCallback($landLeft.btn, CONTROL.back, $start);

  backOption($changeMembership.btn);
  routeCallbackExcept($changeMembership.btn, CONTROL.back, $landChangeProceed.proc);

  backOption($landChangeProceed.btn);
  routeCallback($landChangeProceed.btn, CONTROL.next, $landChanged.proc);

  routeCallback($landChanged.btn, CONTROL.back, $start);

  backOption($becomeGuest.btn);
  routeCallbackExcept($becomeGuest.btn, CONTROL.back, $becomeGuestDone.proc, $becomeGuest.proc.id);

  routeCallback($becomeGuestDone.btn, CONTROL.back, $start);

}