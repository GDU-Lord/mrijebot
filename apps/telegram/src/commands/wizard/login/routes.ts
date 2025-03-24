import { wizardButtons } from ".";
import { routeCallback } from "../../../custom/hooks/routes";
import { $start } from "../../start";

export function WizardLoginRoutes () {

  routeCallback(wizardButtons, 0, $start);

}