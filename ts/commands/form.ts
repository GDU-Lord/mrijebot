import { addUser, cancelUser } from "../api/queue.js";
import { CHAIN } from "../core/actions.js";
import { procedure } from "../core/chain.js";
import { Bot } from "../core/index.js";
import { call, createButtons, getLastCallback, menuProcedure, routeCallback } from "../custom/hooks.js";
import { backButtons } from "./back.js";
import { lands } from "./land.js";
import { landInfoButtons } from "./landinfo.js";
import { $start } from "./start.js";

const applicationTypes = [
  "Я проживаю в цій землі та хочу доєднатися до спільноти як учасник",
  "Я проживаю за межами цієї землі і хочу приєднатися як гість",
  "Я вже є учасником Мрієтворців і лише хочу оновити свої дані",
  "Я проживаю в цій землі та хочу доєднатися до спільноти як учасник",
];

function getLandLinks(land: keyof typeof lands) {
  let links = "";
  for(const name in lands[land][1]) {
    const link = lands[land][1][name];
    links += `👉 <a href="${link}">${name}</a>\n`;
  }
  return links;
}

export const formButtons = createButtons([
  [["❌ Скасувати заявку", 1]]
]);

export const formFinalButtons = createButtons([
  [["☰ Головне меню", 1]]
]);

export const $cancelForm = procedure();


export const $form = procedure();
menuProcedure($form)
  .send(async state => {
    const data = getLastCallback(state, landInfoButtons);
    // prefilled link with the nickname, land and type of application
    let link = `https://docs.google.com/forms/d/e/1FAIpQLScXb2WboVjGQEFvqUjaEAbY4czn0VEZ3889_gbYxF_L0h708Q/viewform?usp=pp_url&entry.1264022843=${state.core.userId}&entry.1252613343=${encodeURIComponent(lands[state.data.land as keyof typeof lands][0])}&entry.56136220=${encodeURIComponent(applicationTypes[data])}`;
    return `<b><u>Заявка</u></b>\n\n<i>${lands[state.data.land][0]}</i>\n\nЗаповни форму за посиланням та очікуй нашої відповіді (це може зайняти декілька хвилин)!\n\n👇👇👇\n<b><a href="${link}">ФОРМА</a></b>`;
  }, formButtons.get)
  .func(async state => {
    const success = await addUser(state.core.userId);
    try {
      await Bot.deleteMessage(state.core.chatId, state.lastMessageSent.message_id);
    } catch {};
    if(success) return CHAIN.NEXT_ACTION;
    return CHAIN.NEXT_LISTENER;
  })
  .send(async state => {
    return `<b><u>Заявка</u></b>\n\nЗаявку прийнято!\n\nПосилання на чати та ресурси спільноти:\n\n${getLandLinks(state.data.land)}`;
  }, formFinalButtons.get);

export function afterStartInit() {
  routeCallback(formButtons, 1, $cancelForm);
  routeCallback(formFinalButtons, 1, $start);
  $cancelForm.make()
    .func(async state => {
      cancelUser(state.core.userId);
    })
    .func(call($start));
}