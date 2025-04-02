import { routeCallback, routeCallbackExcept } from "../../../custom/hooks/routes";
import { backOption } from "../../back";
import { CONTROL, MENU } from "../../mapping";
import { $start } from "../../start";
import { $becomeGuest } from "../mylands/becomeguest";
import { $becomeMaster, $masterRequestSent } from "./becomemaster";
import { $masterPanel } from "./index";
import { loadMasterPrefs, saveDuration, saveGamesPlayed, saveSystemsPlayed, saveSystemsPreferred } from "./middleware";
import { $displayPlayerData, $playerData } from "./playerdata";
import { $gamesPreferred, $systemsPreferred } from "./prefs";
import { $experience, $gamesMastered, $systemsMastered } from "./systemsandxp";

export function profileMasterRoutes () {

  backOption($masterPanel.btn);
  routeCallback($masterPanel.btn, MENU.option[0], $systemsPreferred.proc, loadMasterPrefs);
  routeCallback($masterPanel.btn, MENU.option[1], $gamesPreferred.proc, loadMasterPrefs);
  routeCallback($masterPanel.btn, MENU.option[2], $experience.proc);
  routeCallback($masterPanel.btn, MENU.option[3], $playerData.proc);

  backOption($experience.btn);
  routeCallback($experience.btn, MENU.option[0], $systemsMastered.proc, loadMasterPrefs);
  routeCallback($experience.btn, MENU.option[1], $gamesMastered.proc, loadMasterPrefs);

  backOption($systemsMastered.btn, CONTROL.back, saveSystemsPlayed);
  routeCallbackExcept($systemsMastered.btn, CONTROL.back, $systemsMastered.proc);

  backOption($gamesMastered.btn, CONTROL.back, saveGamesPlayed);
  routeCallbackExcept($gamesMastered.btn, CONTROL.back, $gamesMastered.proc);

  backOption($systemsPreferred.btn, CONTROL.back, saveSystemsPreferred);
  routeCallbackExcept($systemsPreferred.btn, CONTROL.back, $systemsPreferred.proc);

  backOption($gamesPreferred.btn, CONTROL.back, saveDuration);
  routeCallbackExcept($gamesPreferred.btn, CONTROL.back, $gamesPreferred.proc);

  backOption($playerData.btn);
  backOption($displayPlayerData.btn);

  backOption($becomeMaster.btn);
  routeCallback($becomeMaster.btn, CONTROL.next, $masterRequestSent.proc);

  routeCallback($masterRequestSent.btn, CONTROL.back, $start);

}