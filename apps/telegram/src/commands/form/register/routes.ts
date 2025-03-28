import { call } from "../../../custom/hooks/menu";
import { routeCallbackExcept, routeCallback, routeCallbackExceptArray } from "../../../custom/hooks/routes";
import { backOption } from "../../back";
import { CONTROL } from "../../mapping";
import { $start } from "../../start";
import { $city, $email, $formDone, $formSent, $gamesMastered, $gamesPlayed, $land, $mastered, $masterGameTypes, $played, $playGameTypes, $source, $systemsMastered, $systemsPlayed } from "./index";
import { MASTERED, PLAYED } from "./mapping";

export function registerRoutes() {

 $email.chain.func(call($land.proc));

  backOption($land.btn);
  routeCallbackExcept($land.btn, CONTROL.back, $city.proc);
  
  $city.chain.func(call($source.proc));

  backOption($source.btn);
  routeCallbackExcept($source.btn, CONTROL.back, $played.proc);
  
  backOption($played.btn);
  routeCallback($played.btn, PLAYED.has_experience, $gamesPlayed.proc);
  routeCallback($played.btn, PLAYED.no_experience, $formDone.proc);

  backOption($gamesPlayed.btn);
  routeCallbackExcept($gamesPlayed.btn, CONTROL.back, $systemsPlayed.proc);

  backOption($systemsPlayed.btn);
  routeCallback($systemsPlayed.btn, CONTROL.next, $playGameTypes.proc);
  routeCallbackExceptArray($systemsPlayed.btn, [CONTROL.back, CONTROL.next], $systemsPlayed.proc);

  backOption($playGameTypes.btn);
  routeCallback($playGameTypes.btn, CONTROL.next, $mastered.proc);
  routeCallbackExceptArray($playGameTypes.btn, [CONTROL.back, CONTROL.next], $playGameTypes.proc);

  backOption($mastered.btn);
  routeCallback($mastered.btn, MASTERED.is_master, $gamesMastered.proc);
  routeCallback($mastered.btn, MASTERED.wants_master, $masterGameTypes.proc);
  routeCallback($mastered.btn, MASTERED.no_master, $formDone.proc);

  backOption($gamesMastered.btn);
  routeCallbackExcept($gamesMastered.btn, CONTROL.back, $systemsMastered.proc);

  backOption($systemsMastered.btn);
  routeCallback($systemsMastered.btn, CONTROL.next, $masterGameTypes.proc);
  routeCallbackExceptArray($systemsMastered.btn, [CONTROL.back, CONTROL.next], $systemsMastered.proc);

  backOption($masterGameTypes.btn);
  routeCallback($masterGameTypes.btn, CONTROL.next, $formDone.proc);
  routeCallbackExceptArray($masterGameTypes.btn, [CONTROL.back, CONTROL.next], $masterGameTypes.proc);

  backOption($formDone.btn);
  routeCallback($formDone.btn, CONTROL.next, $formSent.proc);

  routeCallback($formSent.btn, CONTROL.back, $start);

}
