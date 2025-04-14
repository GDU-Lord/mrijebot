import { toHTML } from "@telegraf/entity";
import { createAnnouncement, setAnnouncementStatus } from "../../../../api/announcement";
import { CHAIN } from "../../../../core/actions";
import { parseHtmlMessage } from "../../../../custom/hooks/formatting";
import { call } from "../../../../custom/hooks/menu";
import { StateType } from "../../../../custom/hooks/state";
import { CONTROL } from "../../../mapping";
import { optionsField } from "../../../presets/options";
import { textField } from "../../../presets/textfield";
import { text } from "../../../presets/validators";
import TelegramBot from "node-telegram-bot-api";
import { Bot } from "../../../../core";
import { downloadFile } from "./utils";

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
      text: msg.text ?? msg.caption as any,
      entities: msg.entities ?? msg.caption_entities as any
    });
    let data: {
      photo?: {
        id: string;
        uid: string;
      },
    } = {};

    if(msg.photo) {
      const p = msg.photo[msg.photo.length-1];
      data.photo = {
        id: p.file_id,
        uid: p.file_unique_id
      };
    }
    const announcement = await createAnnouncement("local", html, {
      landIds: [state.data.options["profile:chosenLand"]!.id as number]
    }, state.data.storage.user!, data);
    
    if(!announcement) return ["<u><b>Осередок: Оголошення</b></u>\n\nПомилка відправлення оголошення!", CHAIN.NEXT_LISTENER];
    if(data.photo) {
      await downloadFile(data.photo.id, announcement.id, "./cache/img");
    }
    else
      await setAnnouncementStatus(announcement.id, "pending");
    return `<u><b>Осередок: Оголошення</b></u>\n\nОголошення відправлено всім Учасникам Осередку!\n\nℹ️ Ти зможеш редагувати його у <b>Профіль > Мої Оголошення</b>.`;
  },
  [
    [["⬅️Осередок", CONTROL.back]]
  ]
);

$annouceText.chain.func(call($announcementDone.proc));