import { afterInit } from "../../../afterInit.js";
import { routeCallbackExcept, routeCallback, routeCallbackExceptArray, call } from "../../../custom/hooks.js";
import { backOption } from "../../back.js";
import { $start } from "../../start.js";
import { email$, $land, landButtons, $city, city$, $source, sourceButtons, $played, playedButtons, $gamesPlayed, $formDone, gamesPlayedButtons, $systemsPlayed, systemsPlayedButtons, $playGameTypes, playGameTypes, $mastered, masteredButtons, $gamesMastered, $masterGameTypes, gamesMasteredButtons, $systemsMastered, systemsMasteredButtons, masterGameTypesButtons, formDoneButtons, $formSent, formSentButtons } from "./index.js";

export function registerRoutes() {

  email$.func(call($land));

  backOption(0, landButtons);
  routeCallbackExcept(landButtons, 0, $city);
  
  city$.func(call($source));

  backOption(0, sourceButtons);
  routeCallbackExcept(sourceButtons, 0, $played);
  
  backOption(0, playedButtons);
  routeCallback(playedButtons, 1, $gamesPlayed);
  routeCallback(playedButtons, 2, $formDone);

  backOption(0, gamesPlayedButtons);
  routeCallbackExcept(gamesPlayedButtons, 0, $systemsPlayed);

  backOption(0, systemsPlayedButtons);
  routeCallback(systemsPlayedButtons, 1, $playGameTypes);
  routeCallbackExceptArray(systemsPlayedButtons, [0, 1], $systemsPlayed);

  backOption(0, playGameTypes);
  routeCallback(playGameTypes, 1, $mastered);
  routeCallbackExceptArray(playGameTypes, [0, 1], $playGameTypes);

  backOption(0, masteredButtons);
  routeCallback(masteredButtons, 1, $gamesMastered);
  routeCallback(masteredButtons, 2, $masterGameTypes);
  routeCallback(masteredButtons, 3, $formDone);

  backOption(0, gamesMasteredButtons);
  routeCallbackExcept(gamesMasteredButtons, 0, $systemsMastered);

  backOption(0, systemsMasteredButtons);
  routeCallback(systemsMasteredButtons, 1, $masterGameTypes);
  routeCallbackExceptArray(systemsMasteredButtons, [0, 1], $systemsMastered);

  backOption(0, masterGameTypesButtons);
  routeCallback(masterGameTypesButtons, 1, $formDone);
  routeCallbackExceptArray(masterGameTypesButtons, [0, 1], $masterGameTypes);

  backOption(0, formDoneButtons);
  routeCallback(formDoneButtons, 1, $formSent);

  routeCallback(formSentButtons, 0, $start);

}
