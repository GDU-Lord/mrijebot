import { toHTML } from "@telegraf/entity";
import { createAnnouncement } from "../../../../api/announcement";
import { CHAIN } from "../../../../core/actions";
import { parseHtmlMessage } from "../../../../custom/hooks/formatting";
import { call } from "../../../../custom/hooks/menu";
import { StateType } from "../../../../custom/hooks/state";
import { CONTROL } from "../../../mapping";
import { optionsField } from "../../../presets/options";
import { textField } from "../../../presets/textfield";
import { text } from "../../../presets/validators";
import TelegramBot from "node-telegram-bot-api";

export const $annouceText = textField(
  "announce:text",
  async state => {
    // check for rigths
    return `<u><b>Осередок: Оголошення</b></u>\n\nВведи текст оголошення (використовуй форматування!):`;
  },
  text(Infinity)
);

export const $announcementDone = optionsField<StateType>(
  async state => {
    const msg = state.core.inputs["announce:text"] as TelegramBot.Message;
    const html = toHTML({
      text: msg.text as any,
      entities: msg.entities as any
    });
    const res = await createAnnouncement("local", html, {
      landIds: [state.data.options["profile:chosenLand"]!.id as number]
    }, state.data.storage.user!);
    if(!res) return ["<u><b>Осередок: Оголошення</b></u>\n\nПомилка відправлення оголошення!", CHAIN.NEXT_LISTENER];
    return `<u><b>Осередок: Оголошення</b></u>\n\nОголошення відправлено всім Учасникам Осередку!\n\nℹ️ Ти зможеш редагувати його у <b>Профіль > Мої Оголошення</b>.`;
  },
  [
    [["⬅️Осередок", CONTROL.back]]
  ]
);

$annouceText.chain.func(call($announcementDone.proc));