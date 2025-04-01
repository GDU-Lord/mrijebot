import { createSystem } from "../../../api";
import { CHAIN } from "../../../core/actions";
import { procedure } from "../../../core/chain";
import { deleteLastInput, deleteLastMessage } from "../../../custom/hooks/inputs";
import { editLast } from "../../../custom/hooks/messageOptions";
import { StateType } from "../../../custom/hooks/state";
import { isWizard } from "../../../custom/hooks/wizard";
import { wizardButtons } from "../routes";

export const $createSystem = procedure();
$createSystem.make()
  .func(deleteLastMessage())
  .func(isWizard())
  .send("Введи назву НОВОЇ системи", wizardButtons.get, editLast())
  .input("wizard:newSystemName")
  .func(deleteLastInput("wizard:newSystemName"))
  .send<StateType>(async state => {
    const name = state.core.inputs["wizard:newSystemName"]?.text;
    if(!name) return ["Помилка!", CHAIN.EXIT];
    const res = await createSystem(name);
    if(!res) return ["Помилка!", CHAIN.EXIT];
    return "Систему додано!";
  }, wizardButtons.get, editLast());
