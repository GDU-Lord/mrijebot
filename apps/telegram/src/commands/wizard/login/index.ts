import { procedure } from "../../../core/chain";
import { initState, StateType } from "../../../custom/hooks/state";
import "dotenv/config";
import { editLast } from "../../../custom/hooks/messageOptions";
import { CHAIN } from "../../../core/actions";
import { $start } from "../../start";
import { deleteLastInput, deleteLastMessage } from "../../../custom/hooks/inputs";
import { wizardButtons } from "../routes";

export const $auth = procedure();
$auth.make()
  .func(deleteLastMessage())
  .func(initState(true))
  .send("Пароль:", wizardButtons.get, editLast())
  .input("wizard:password", true)
  .func(deleteLastInput("wizard:password"))
  .func<StateType>(async state => {
    if(state.core.inputs["wizard:password"]?.text === process.env.WIZARD_PASSWORD) {
      state.data.storage.isWizard = true;
      return CHAIN.NEXT_ACTION;
    }
    state.call($start);
    return CHAIN.EXIT;
  })
  .send<StateType>("Авторизація успішна. Тепер ти маєш доступ до команд адміністратора!\n\n/admin", wizardButtons.get, editLast());