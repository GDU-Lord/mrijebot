import { routeCallback, routeCallbackExcept } from "../../../custom/hooks/routes";
import { backOption } from "../../back";
import { CONTROL, MENU } from "../../mapping";
import { $masterPanel } from "./index";
import { $displayPlayerData, $playerData } from "./playerdata";
import { $gamesPreferred, $systemsPreferred } from "./prefs";
import { $experience, $gamesMastered, $systemsMastered } from "./systemsandxp";

export function profileMasterRoutes () {

  backOption($masterPanel.btn);
  routeCallback($masterPanel.btn, MENU.option[0], $systemsPreferred.proc);
  routeCallback($masterPanel.btn, MENU.option[1], $gamesPreferred.proc);
  routeCallback($masterPanel.btn, MENU.option[2], $experience.proc);
  routeCallback($masterPanel.btn, MENU.option[3], $playerData.proc);

  backOption($experience.btn);
  routeCallback($experience.btn, MENU.option[0], $systemsMastered.proc);
  routeCallback($experience.btn, MENU.option[1], $gamesMastered.proc);

  backOption($systemsMastered.btn);
  routeCallbackExcept($systemsMastered.btn, CONTROL.back, $systemsMastered.proc);

  backOption($gamesMastered.btn);
  routeCallbackExcept($gamesMastered.btn, CONTROL.back, $gamesMastered.proc);

  backOption($systemsPreferred.btn);
  routeCallbackExcept($systemsPreferred.btn, CONTROL.back, $systemsPreferred.proc);

  backOption($gamesPreferred.btn);
  routeCallbackExcept($gamesPreferred.btn, CONTROL.back, $gamesPreferred.proc);

  backOption($playerData.btn);
  backOption($displayPlayerData.btn);

}