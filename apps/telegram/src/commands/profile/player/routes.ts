import { routeCallback, routeCallbackExcept } from "../../../custom/hooks/routes";
import { backOption } from "../../back";
import { CONTROL, MENU } from "../../mapping";
import { $playerPanel } from "./index";
import { loadPlayerPrefs, saveAspects, saveDuration, saveGamesPlayed, saveMasterMessage, saveSystemsPlayed, saveSystemsPreferred, saveTriggers } from "./middleware";
import { $experience, $systemsPlayed, $gamesPlayed } from "./systemsandxp";
import { $systemsPreferred, $prefferences, $myTriggers, $prefFight, $textForMaster, $prefSocial, $prefExplore, $gamesPreferred } from "./triggersandprefs";

export function profilePlayerRoutes () {

  backOption($playerPanel.btn);
  routeCallback($playerPanel.btn, MENU.option[0], $systemsPreferred.proc, loadPlayerPrefs);
  routeCallback($playerPanel.btn, MENU.option[1], $experience.proc);
  routeCallback($playerPanel.btn, MENU.option[2], $prefferences.proc);
  routeCallback($playerPanel.btn, MENU.option[3], $myTriggers.proc, loadPlayerPrefs);

  backOption($experience.btn);
  routeCallback($experience.btn, MENU.option[0], $systemsPlayed.proc, loadPlayerPrefs);
  routeCallback($experience.btn, MENU.option[1], $gamesPlayed.proc, loadPlayerPrefs);

  backOption($systemsPlayed.btn, CONTROL.back, saveSystemsPlayed);
  routeCallbackExcept($systemsPlayed.btn, CONTROL.back, $systemsPlayed.proc);

  backOption($gamesPlayed.btn, CONTROL.back, saveGamesPlayed);
  routeCallbackExcept($gamesPlayed.btn, CONTROL.back, $gamesPlayed.proc);

  backOption($myTriggers.btn, CONTROL.back, saveTriggers);
  routeCallback($myTriggers.btn, CONTROL.clear, $myTriggers.proc);
  
  backOption($systemsPreferred.btn, CONTROL.back, saveSystemsPreferred);
  routeCallbackExcept($systemsPreferred.btn, CONTROL.back, $systemsPreferred.proc);

  backOption($gamesPreferred.btn, CONTROL.back, saveDuration);
  routeCallbackExcept($gamesPreferred.btn, CONTROL.back, $gamesPreferred.proc);

  backOption($prefferences.btn);
  routeCallback($prefferences.btn, MENU.option[0], $prefFight.proc, loadPlayerPrefs);
  routeCallback($prefferences.btn, MENU.option[1], $gamesPreferred.proc, loadPlayerPrefs);
  routeCallback($prefferences.btn, MENU.option[2], $textForMaster.proc, loadPlayerPrefs);

  backOption($textForMaster.btn, CONTROL.back, saveMasterMessage);
  routeCallbackExcept($textForMaster.btn, CONTROL.back, $textForMaster.proc);

  backOption($prefFight.btn);
  routeCallbackExcept($prefFight.btn, CONTROL.back, $prefSocial.proc);

  backOption($prefSocial.btn);
  routeCallbackExcept($prefSocial.btn, CONTROL.back, $prefExplore.proc);

  backOption($prefExplore.btn);
  routeCallbackExcept($prefExplore.btn, CONTROL.back, $prefferences.proc, saveAspects);

}