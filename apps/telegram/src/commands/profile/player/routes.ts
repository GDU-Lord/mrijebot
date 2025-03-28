import { routeCallback, routeCallbackExcept, routeCallbackExceptArray } from "../../../custom/hooks/routes";
import { backOption } from "../../back";
import { CONTROL, MENU } from "../../mapping";
import { $playerPanel } from "./index";
import { $experience, $systemsPlayed, $gamesPlayed } from "./systemsandxp";
import { $systemsPreferred, $prefferences, $myTriggers, $prefFight, $textForMaster, $prefSocial, $prefExplore, $gamesPreferred } from "./triggersandprefs";

export function profilePlayerRoutes () {

  backOption($playerPanel.btn);
  routeCallback($playerPanel.btn, MENU.option[0], $systemsPreferred.proc);
  routeCallback($playerPanel.btn, MENU.option[1], $experience.proc);
  routeCallback($playerPanel.btn, MENU.option[2], $prefferences.proc);
  routeCallback($playerPanel.btn, MENU.option[3], $myTriggers.proc);

  backOption($experience.btn);
  routeCallback($experience.btn, MENU.option[0], $systemsPlayed.proc);
  routeCallback($experience.btn, MENU.option[1], $gamesPlayed.proc);

  backOption($systemsPlayed.btn);
  routeCallbackExcept($systemsPlayed.btn, CONTROL.back, $systemsPlayed.proc);

  backOption($gamesPlayed.btn);
  routeCallbackExcept($systemsPlayed.btn, CONTROL.back, $systemsPlayed.proc);

  backOption($myTriggers.btn);
  routeCallback($myTriggers.btn, CONTROL.clear, $myTriggers.proc);

  backOption($systemsPreferred.btn);
  routeCallbackExcept($systemsPreferred.btn, CONTROL.back, $systemsPreferred.proc);

  backOption($gamesPreferred.btn);
  routeCallbackExcept($gamesPreferred.btn, CONTROL.back, $gamesPreferred.proc);

  backOption($prefferences.btn);
  routeCallback($prefferences.btn, MENU.option[0], $prefFight.proc);
  routeCallback($prefferences.btn, MENU.option[1], $gamesPreferred.proc);
  routeCallback($prefferences.btn, MENU.option[2], $textForMaster.proc);

  backOption($textForMaster.btn);
  routeCallbackExcept($textForMaster.btn, CONTROL.back, $textForMaster.proc);

  backOption($prefFight.btn);
  routeCallbackExcept($prefFight.btn, CONTROL.back, $prefSocial.proc);

  backOption($prefSocial.btn);
  routeCallbackExcept($prefSocial.btn, CONTROL.back, $prefExplore.proc);

  backOption($prefExplore.btn);
  routeCallbackExcept($prefExplore.btn, CONTROL.back, $prefferences.proc);

}