import { getLastCallback } from "../../../custom/hooks/buttons";
import { call, removeCrum } from "../../../custom/hooks/menu";
import { saveValue, saveValueInput } from "../../../custom/hooks/options";
import { StateType } from "../../../custom/hooks/state";
import { $back } from "../../back";
import { loadUser } from "../../loaduser";
import { CONTROL } from "../../mapping";
import { optionsField } from "../../presets/options";
import { optionsOtherField } from "../../presets/optionsOther";
import { textField } from "../../presets/textfield";
import { email, text } from "../../presets/validators";
import { setUserData } from "./utils";

export const $myData = optionsField<StateType>(
  async state => {
    const user = state.data.storage.user!;
    return `<u><b>👤Профіль: Контактні Дані</b></u>\n\n<b>Ім'я</b>: ${user.username}\n<b>Займенники</b>: <i>в розробці</i>\n<b>Email</b>: ${user.email}\n<b>Місто</b>: ${user.city}`;
  },
  [
    [["📌 Змінити місто", { field: "city", text: "назву міста" }]],
    [["✉️ Змінити Email", { field: "email", text: "Email" }]],
    [["⬅️ Назад", CONTROL.back]]
  ],
  saveValue("profile:dataField", CONTROL.back)
);

export const $editData = textField<StateType>(
  "profile:dataValue",
  async state => {
    const text = state.data.options["profile:dataField"].text as string;
    return `<u><b>👤Профіль: Контактні Дані</b></u>\n\nВведи ${text}:`;
  },
  async (val, msg, state) => {
    const field = state.data.options["profile:dataField"].field as string;
    if(field === "email") return email()(val);
    if(field === "city") return text(255, 2)(val);
    return false;
  }
);

$editData.chain.func<StateType>(async state => {
  const text = state.core.inputs["profile:dataValue"]?.text;
  if(!text) return;
  await setUserData(state.data.storage.user!.id, state.data.options["profile:dataField"].field, text);
  await loadUser(state);
}).func(call($back));