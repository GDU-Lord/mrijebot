import { routeCallback, routeCallbackArray, routeCallbackExcept } from "../../custom/hooks/routes.js";
import { $back, backOption } from "../back.js";
import { $start } from "../start.js";
import { $main } from "./index.js";
import { $becomeGuest, $becomeGuestDone } from "./mylands/becomeguest.js";
import { $changeMembership, $landChangeProceed, $landChanged } from "./mylands/changemembership.js";
import { $myLands } from "./mylands/index.js";
import { $myLandsList, $landPanel } from "./mylands/landlist.js";
import { $playerPanel } from "./player/index.js";
import { $experience, $gamesPlayed, $systemsPlayed } from "./player/systemsandxp.js";

export function profileRoutes () {

  backOption(0, $main.btn);
  routeCallback($main.btn, 1, $myLands.proc);
  routeCallback($main.btn, 3, $playerPanel.proc);

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

  backOption(0, $playerPanel.btn);
  routeCallback($playerPanel.btn, 2, $experience.proc);

  backOption(0, $experience.btn);
  routeCallback($experience.btn, 1, $systemsPlayed.proc);
  routeCallback($experience.btn, 2, $gamesPlayed.proc);

  backOption(0, $systemsPlayed.btn);
  routeCallbackExcept($systemsPlayed.btn, 0, $systemsPlayed.proc);

  backOption(0, $gamesPlayed.btn);
  routeCallbackExcept($gamesPlayed.btn, 0, $gamesPlayed.proc);

}