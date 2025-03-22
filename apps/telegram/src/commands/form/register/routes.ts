import { call } from "../../../custom/hooks/menu";
import { routeCallbackExcept, routeCallback, routeCallbackExceptArray } from "../../../custom/hooks/routes";
import { backOption } from "../../back";
import { $start } from "../../start";
import { $city, $email, $formDone, $formSent, $gamesMastered, $gamesPlayed, $land, $mastered, $masterGameTypes, $played, $playGameTypes, $source, $systemsMastered, $systemsPlayed } from "./index";

export function registerRoutes() {

 $email.chain.func(call($land.proc));

  backOption(0, $land.btn);
  routeCallbackExcept($land.btn, 0, $city.proc);
  
  $city.chain.func(call($source.proc));

  backOption(0, $source.btn);
  routeCallbackExcept($source.btn, 0, $played.proc);
  
  backOption(0, $played.btn);
  routeCallback($played.btn, 1, $gamesPlayed.proc);
  routeCallback($played.btn, 2, $formDone.proc);

  backOption(0, $gamesPlayed.btn);
  routeCallbackExcept($gamesPlayed.btn, 0, $systemsPlayed.proc);

  backOption(0, $systemsPlayed.btn);
  routeCallback($systemsPlayed.btn, 1, $playGameTypes.proc);
  routeCallbackExceptArray($systemsPlayed.btn, [0, 1], $systemsPlayed.proc);

  backOption(0, $playGameTypes.btn);
  routeCallback($playGameTypes.btn, 1, $mastered.proc);
  routeCallbackExceptArray($playGameTypes.btn, [0, 1], $playGameTypes.proc);

  backOption(0, $mastered.btn);
  routeCallback($mastered.btn, 1, $gamesMastered.proc);
  routeCallback($mastered.btn, 2, $masterGameTypes.proc);
  routeCallback($mastered.btn, 3, $formDone.proc);

  backOption(0, $gamesMastered.btn);
  routeCallbackExcept($gamesMastered.btn, 0, $systemsMastered.proc);

  backOption(0, $systemsMastered.btn);
  routeCallback($systemsMastered.btn, 1, $masterGameTypes.proc);
  routeCallbackExceptArray($systemsMastered.btn, [0, 1], $systemsMastered.proc);

  backOption(0, $masterGameTypes.btn);
  routeCallback($masterGameTypes.btn, 1, $formDone.proc);
  routeCallbackExceptArray($masterGameTypes.btn, [0, 1], $masterGameTypes.proc);

  backOption(0, $formDone.btn);
  routeCallback($formDone.btn, 1, $formSent.proc);

  routeCallback($formSent.btn, 0, $start);

}
