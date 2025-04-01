import { createLand } from "../../../api";
import { procedure } from "../../../core/chain";
import { deleteLastInput, deleteLastMessage } from "../../../custom/hooks/inputs";
import { editLast } from "../../../custom/hooks/messageOptions";
import { StateType } from "../../../custom/hooks/state";
import { isWizard } from "../../../custom/hooks/wizard";
import { wizardButtons } from "../routes";

export const $createLand = procedure();
$createLand.make()
  .func(deleteLastMessage())
  .func(isWizard())
  
  .send("Введи назву НОВОГО осередку", wizardButtons.get, editLast())
  .input("wizard:newLandName")
  .func(deleteLastInput("wizard:newLandName"))
  
  .send("Введи регіони, що належать до осередку. Німецькою мовою, через кому", wizardButtons.get, editLast())
  .input("wizard:newLandRegions")
  .func(deleteLastInput("wizard:newLandRegions"))
  
  .send("Введи частини вказаних регіонів, що не належать до осередку.\n\n/skip - якщо таких немає", wizardButtons.get, editLast())
  .input("wizard:newLandExcludeRegions")
  .func(deleteLastInput("wizard:newLandExcludeRegions"))
  
  .send<StateType>(async state => {
    const inpName = state.core.inputs["wizard:newLandName"]!.text!;
    const inpInclude = state.core.inputs["wizard:newLandRegions"]!.text!;
    const inpExclude = state.core.inputs["wizard:newLandExcludeRegions"]!.text!;
    const name = inpName;
    const include = inpInclude.split(",").map(s => s.trim());
    const exclude = inpExclude === "/skip" ? [] : inpExclude.split(",").map(s => s.trim());
    const except = exclude.length > 0 ? ` (крім: ${exclude.join(", ")})` : "";
    return `<u><b>Готовий опис твого осередку:</b></u>\n\n<b>"${name}"</b>: ${include.join(", ")}${except}\n\n/save - зберегти\n/cancel - cкасувати`;
  }, wizardButtons.get, editLast())
  .input("wizard:newLandSubmit")
  .func(deleteLastInput("wizard:newLandSubmit"))
  
  .send<StateType>(async state => {
    if(state.core.inputs["wizard:newLandSubmit"]?.text === "/save") {
      const inpName = state.core.inputs["wizard:newLandName"]!.text!;
      const inpInclude = state.core.inputs["wizard:newLandRegions"]!.text!;
      const inpExclude = state.core.inputs["wizard:newLandExcludeRegions"]!.text!;
      const name = inpName;
      const include = inpInclude.split(",").map(s => s.trim());
      const exclude = inpExclude === "/skip" ? [] : inpExclude.split(",").map(s => s.trim());
      const except = exclude.length > 0 ? `(крім: ${exclude.join(", ")})` : "";
      const region = include + except;
      const res = await createLand(name, region);
      return "Осередок створено!";
    }
    return "Скасовано!";
  }, wizardButtons.get, editLast());