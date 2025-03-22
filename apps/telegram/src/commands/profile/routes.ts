import { routeCallback, routeCallbackArray, routeCallbackExcept } from "../../custom/hooks/routes";
import { $back, backOption } from "../back";
import { $start } from "../start";
import { $idCard } from "./idcard";
import { $main } from "./index";
import { $masterPanel } from "./master/index";
import { $becomeGuest, $becomeGuestDone } from "./mylands/becomeguest";
import { $changeMembership, $landChangeProceed, $landChanged } from "./mylands/changemembership";
import { $myLands } from "./mylands/index";
import { $myLandsList, $landPanel } from "./mylands/landlist";
import { $playerPanel } from "./player/index";
import { $experience, $gamesPlayed, $systemsPlayed } from "./player/systemsandxp";
import { $myTriggers, $prefExplore, $prefferences, $prefFight, $prefSocial, $systemsPreferred, $textForMaster } from "./player/triggersandprefs";

export function profileRoutes () {

  backOption(0, $main.btn);
  routeCallback($main.btn, 1, $myLands.proc);
  routeCallback($main.btn, 3, $playerPanel.proc);
  routeCallback($main.btn, 4, $masterPanel.proc);
  routeCallback($main.btn, 6, $idCard.proc);

  backOption(0, $idCard.btn);

  backOption(0, $myLands.btn);
  routeCallback($myLands.btn, 1, $myLandsList.proc);
  routeCallback($myLands.btn, 2, $changeMembership.proc);
  routeCallback($myLands.btn, 3, $becomeGuest.proc);

  backOption(0, $myLandsList.btn);
  routeCallbackExcept($myLandsList.btn, 0, $landPanel.proc);

  backOption(0, $landPanel.btn);
  routeCallback($landPanel.btn, 2, $changeMembership.proc);

  backOption(0, $changeMembership.btn);
  routeCallbackExcept($changeMembership.btn, 0, $landChangeProceed.proc);

  backOption(0, $landChangeProceed.btn);
  routeCallback($landChangeProceed.btn, 1, $landChanged.proc);

  routeCallback($landChanged.btn, 0, $start);

  backOption(0, $becomeGuest.btn);
  routeCallbackExcept($becomeGuest.btn, 0, $becomeGuestDone.proc);

  routeCallback($becomeGuestDone.btn, 0, $start);

}