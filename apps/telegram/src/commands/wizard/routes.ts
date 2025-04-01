import { createButtons } from "../../custom/hooks/buttons";
import { routeCallback } from "../../custom/hooks/routes";
import { CONTROL } from "../mapping";
import { $start } from "../start";

export const wizardButtons = createButtons([
  [["Головне меню", CONTROL.back]]
]);

export function WizardLoginRoutes () {

  routeCallback(wizardButtons, CONTROL.back, $start);

}