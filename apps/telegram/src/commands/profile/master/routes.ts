import { routeCallback, routeCallbackExcept } from "../../../custom/hooks/routes";
import { backOption } from "../../back";
import { $masterPanel } from "./index";
import { $displayPlayerData, $playerData } from "./playerdata";
import { $gamesPreferred, $systemsPreferred } from "./prefs";
import { $experience, $gamesMastered, $systemsMastered } from "./systemsandxp";

export function profileMasterRoutes () {

  backOption(0, $masterPanel.btn);
  routeCallback($masterPanel.btn, 1, $systemsPreferred.proc);
  routeCallback($masterPanel.btn, 2, $gamesPreferred.proc);
  routeCallback($masterPanel.btn, 3, $experience.proc);
  routeCallback($masterPanel.btn, 4, $playerData.proc);

  backOption(0, $experience.btn);
  routeCallback($experience.btn, 1, $systemsMastered.proc);
  routeCallback($experience.btn, 2, $gamesMastered.proc);

  backOption(0, $systemsMastered.btn);
  routeCallbackExcept($systemsMastered.btn, 0, $systemsMastered.proc);

  backOption(0, $gamesMastered.btn);
  routeCallbackExcept($gamesMastered.btn, 0, $gamesMastered.proc);

  backOption(0, $systemsPreferred.btn);
  routeCallbackExcept($systemsPreferred.btn, 0, $systemsPreferred.proc);

  backOption(0, $gamesPreferred.btn);
  routeCallbackExcept($gamesPreferred.btn, 0, $gamesPreferred.proc);

  backOption(0, $playerData.btn);
  backOption(0, $displayPlayerData.btn);

}