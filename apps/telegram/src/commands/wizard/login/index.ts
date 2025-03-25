import TelegramBot from "node-telegram-bot-api";
import { afterInit } from "../../../afterInit";
import { procedure } from "../../../core/chain";
import { initState, StateType } from "../../../custom/hooks/state";
import { WizardLoginRoutes } from "./routes";
import { backButtons } from "../../back";
import "dotenv/config";
import { editLast } from "../../../custom/hooks/messageOptions";
import { addCrum } from "../../../custom/hooks/menu";
import { CHAIN } from "../../../core/actions";
import { $start } from "../../start";
import { createButtons } from "../../../custom/hooks/buttons";
import { deleteLastInput } from "../../../custom/hooks/inputs";
import { isWizard } from "../../../custom/hooks/wizard";
import { createLand } from "../../../api/land";
import { createSystem } from "../../../api";

afterInit.push(WizardLoginRoutes);

export const wizardButtons = createButtons([
  [["Головне меню", 0]]
]);

export const $wizard = procedure();
$wizard.make()
  .func(initState(true))
  .send("Пароль: ", wizardButtons.get, editLast())
  .input("wizard:password")
  .func(deleteLastInput("wizard:password"))
  .func<StateType>(async state => {
    if(state.core.inputs["wizard:password"]?.text === process.env.WIZARD_PASSWORD) {
      state.data.storage.isWizard = true;
      return CHAIN.NEXT_ACTION;
    }
    state.call($start);
    return CHAIN.NEXT_LISTENER;
  })
  .send<StateType>("Авторизація успішна. Тепер ти маєш доступ до команд адміністратора!", wizardButtons.get, editLast());

export const $createLand = procedure();
$createLand.make()
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

export const $createSystem = procedure();
$createSystem.make()
  .func(isWizard())
  .send("Введи назву НОВОЇ системи", wizardButtons.get, editLast())
  .input("wizard:newSystemName")
  .func(deleteLastInput("wizard:newSystemName"))
  .send<StateType>(async state => {
    const name = state.core.inputs["wizard:newSystemName"]?.text;
    if(!name) return "Помилка 1!";
    const res = await createSystem(name);
    if(!res) return "Помилка 2!";
    return "Систему додано!";
  }, wizardButtons.get, editLast());
