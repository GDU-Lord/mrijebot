import { createRequest } from "../../../api/request";
import { assignGlobalRole } from "../../../api/role";
import { keyboard } from "../../../custom/hooks/buttons";
import { StateType } from "../../../custom/hooks/state";
import { CONTROL } from "../../mapping";
import { optionsField } from "../../presets/options";
import { getRoleByTag, hasGlobalRole } from "../roles";

export const $becomeMaster = optionsField(
  async state => {
    const requested = await hasGlobalRole(state, "master_request") ? "❗Твоя заявка вже обробляється Координаційним Органом твого Осередку!\n\n" : "ℹ️Заявка буде оброблятися Координаційним Органом твого Осередку!\n\n";
    return `<b><u>👤Профіль: Стати Майстром</u></b>\n\nОтримавши статус Майстра, ти зможеш оголошувати ігри!\n\n${requested}ℹ️Ти отримаєш повідомлення, коли твій статус буде підтверджено!`;
  },
  async state => {
    const requested = await hasGlobalRole(state, "master_request");
    let buttons: keyboard = [[["⬅️Назад", CONTROL.back]]];
    if(!requested)
      buttons = [[["✅Продовжити", CONTROL.next]], ...buttons];
    return buttons;
  }
)

export const $masterRequestSent = optionsField<StateType>(
  async state => {
    const user = state.data.storage.user!;
    const member = user.memberships.find(m => m.status === "participant");
    if(!user || !member) return "<b><u>👤Профіль: Стати Майстром</u></b>\n\nПомилка відправлення заявки!";
    const req = await createRequest("become_master", {
      from: {
        member
      },
      to: {
        role: await getRoleByTag(state, "master_inspector")
      },
    });
    if(!req) return "<b><u>👤Профіль: Стати Майстром</u></b>\n\nПомилка відправлення заявки!";
    const masterRole = await getRoleByTag(state, "master_request");
    const res = await assignGlobalRole(masterRole!.id, state.data.storage.user!.id);
    if(!res) return "<b><u>👤Профіль: Стати Майстром</u></b>\n\nПомилка відправлення заявки!";
    return "<b><u>👤Профіль: Стати Майстром</u></b>\n\nЗаявку відправлено, очікуй повідомлення!";
  },
  [
    [["⬅️Головне меню", CONTROL.back]]
  ]
);