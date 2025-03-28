import { wizardButtons } from ".";
import { routeCallback } from "../../../custom/hooks/routes";
import { CONTROL } from "../../mapping";
import { $start } from "../../start";

export function WizardLoginRoutes () {

  routeCallback(wizardButtons, CONTROL.back, $start);

}