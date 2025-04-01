import { wizardButtons, WizardLoginRoutes } from "./routes";
import { afterInit } from "../../afterInit";
import { procedure } from "../../core/chain";
import { isWizard } from "../../custom/hooks/wizard";
import { editLast } from "../../custom/hooks/messageOptions";
import { deleteLastMessage } from "../../custom/hooks/inputs";

export * from "./lands";
export * from "./login";
export * from "./systems";

afterInit.push(WizardLoginRoutes);

export function trimCommand(command: string) {
  return command.slice(1);
}

export const $wizard = procedure();
$wizard.make()
  .func(deleteLastMessage())
  .func(isWizard())
  .send("Вітаємо в адмінській панелі!\n\n/addland - cтворити осередок\n\n/addsystem - додати ігрову систему\n\n/addrole - створити роль\n\n/getrole - отримати роль\n\n/logout - вийти з акауту адміністратора", wizardButtons.get, editLast());

