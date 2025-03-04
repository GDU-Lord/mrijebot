import { routeCallback, routeCallbackExcept } from "../../custom/hooks/routes.js";
import { backOption } from "../back.js";
import { $start } from "../start.js";
import { $main } from "./index.js";
import { $changeMembership, $landChangeProceed, $landChanged } from "./mylands/changemembership.js";
import { $myLands } from "./mylands/index.js";
import { $myLandsList, $landPanel } from "./mylands/landlist.js";

export function profileRoutes () {

  backOption(0, $main.btn);
  routeCallback($main.btn, 1, $myLands.proc);

  backOption(0, $myLands.btn);
  routeCallback($myLands.btn, 1, $myLandsList.proc);
  routeCallback($myLands.btn, 2, $changeMembership.proc);

  backOption(0, $myLandsList.btn);
  routeCallbackExcept($myLandsList.btn, 0, $landPanel.proc);

  backOption(0, $landPanel.btn);
  routeCallback($landPanel.btn, 2, $changeMembership.proc);

  backOption(0, $changeMembership.btn);
  routeCallbackExcept($changeMembership.btn, 0, $landChangeProceed.proc);

  routeCallback($landChangeProceed.btn, 1, $landChanged.proc);
  backOption(0, $landChangeProceed.btn);

  routeCallback($landChanged.btn, 0, $start);

}