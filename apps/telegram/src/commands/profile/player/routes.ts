import { routeCallback, routeCallbackExcept } from "../../../custom/hooks/routes";
import { backOption } from "../../back";
import { $playerPanel } from "./index";
import { $experience, $systemsPlayed, $gamesPlayed } from "./systemsandxp";
import { $systemsPreferred, $prefferences, $myTriggers, $prefFight, $textForMaster, $prefSocial, $prefExplore, $gamesPreferred } from "./triggersandprefs";

export function profilePlayerRoutes () {

  backOption(0, $playerPanel.btn);
  routeCallback($playerPanel.btn, 1, $systemsPreferred.proc);
  routeCallback($playerPanel.btn, 2, $experience.proc);
  routeCallback($playerPanel.btn, 3, $prefferences.proc);
  routeCallback($playerPanel.btn, 4, $myTriggers.proc);

  backOption(0, $experience.btn);
  routeCallback($experience.btn, 1, $systemsPlayed.proc);
  routeCallback($experience.btn, 2, $gamesPlayed.proc);

  backOption(0, $systemsPlayed.btn);
  routeCallbackExcept($systemsPlayed.btn, 0, $systemsPlayed.proc);

  backOption(0, $gamesPlayed.btn);
  routeCallbackExcept($gamesPlayed.btn, 0, $gamesPlayed.proc);

  backOption(0, $myTriggers.btn);
  routeCallback($myTriggers.btn, 1, $myTriggers.proc);

  backOption(0, $systemsPreferred.btn);
  routeCallbackExcept($systemsPreferred.btn, 0, $systemsPreferred.proc);

  backOption(0, $gamesPreferred.btn);
  routeCallbackExcept($gamesPreferred.btn, 0, $gamesPreferred.proc);

  backOption(0, $prefferences.btn);
  routeCallback($prefferences.btn, 1, $prefFight.proc);
  routeCallback($prefferences.btn, 2, $gamesPreferred.proc);
  routeCallback($prefferences.btn, 3, $textForMaster.proc);

  backOption(0, $textForMaster.btn);
  routeCallbackExcept($textForMaster.btn, 0, $textForMaster.proc);

  backOption(0, $prefFight.btn);
  routeCallbackExcept($prefFight.btn, 0, $prefSocial.proc);

  backOption(0, $prefSocial.btn);
  routeCallbackExcept($prefSocial.btn, 0, $prefExplore.proc);

  backOption(0, $prefExplore.btn);
  routeCallbackExcept($prefExplore.btn, 0, $prefferences.proc);

}