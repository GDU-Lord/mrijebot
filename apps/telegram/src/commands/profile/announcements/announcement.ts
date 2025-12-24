import { toHTML } from "@telegraf/entity";
import { StateType } from "../../../custom/hooks/state";
import { CONTROL, MENU } from "../../mapping";
import { optionsField } from "../../presets/options";
import { optionsOtherField } from "../../presets/optionsOther";
import TelegramBot from "node-telegram-bot-api";
import { textField } from "../../presets/textfield";
import { text } from "../../presets/validators";
import { createAnnouncement, getAnnouncement, setAnnouncementStatus, setAnnouncementText } from "../../../api/announcement";
import { downloadFile } from "../mylands/landadmin/utils";
import { CHAIN } from "../../../core/actions";
import { Announcement } from "../../../../../core/src/entities/announcement.entity";
import { call } from "../../../custom/hooks/menu";
import { getAllRoles } from "../../../api/role";
import { getUser } from "../../../api";
import { getDate } from "../../../custom/hooks/date";
import { getLastCallback } from "../../../custom/hooks/buttons";

// add photo display (through a separate array in 'content' that keeps the old ids)
export const $announcement = optionsField<StateType>(
  async state => {
    const text = state.data.options["announcements:current"]?.text as string;
    return `<u><b>⚙️Профіль: Панель Оголошень</b></u>\n\n${text}`;
  },
  [
    [["ℹ️ Метадані", MENU.option[0]]],
    [["🖊️Змінити текст", MENU.option[1]]],
    [["⬅️Назад", CONTROL.back]],
  ]
);

export const $annouceEditInput = textField(
  "announcements:editText",
  async state => {
    return `<u><b>⚙️Профіль: Панель Оголошень</b></u>\n\nВведи новий текст оголошення (попередній текст буде втрачено!):`;
  },
  text(Infinity)
);

export const $announcementEdit = optionsField<StateType>(
  async state => {
    const msg = state.core.inputs["announcements:editText"] as TelegramBot.Message;
    const announcement = state.data.options["announcements:current"] as Announcement;
    const html = toHTML({
      text: msg.text ?? msg.caption as any,
      entities: msg.entities ?? msg.caption_entities as any
    });

    if(html === announcement.text) {
      return `<u><b>⚙️Профіль: Панель Оголошень</b></u>\n\nТекст оголошення оновлено!`;
    }

    const res = await setAnnouncementText(announcement.id, html);
    
    if(!res) return ["<u><b>⚙️Профіль: Панель Оголошень</b></u>\n\nПомилка оновлення оголошення!", CHAIN.NEXT_LISTENER];
    
    const { id } = state.data.options["announcements:current"] as Announcement;
    state.data.options["announcements:current"] = await getAnnouncement(id);

    return `<u><b>⚙️Профіль: Панель Оголошень</b></u>\n\nТекст оголошення оновлено!`;
  },
  [
    [["⬅️Назад", CONTROL.back]]
  ],
  async state => {
    state.data.crums.pop();
  }
);

export const $announcementMeta = optionsField<StateType>(
  async state => {
    const announcement = state.data.options["announcements:current"] as Announcement;
    const allRoles = state.data.storage.roles ?? [];
    const allLands = state.data.storage.lands ?? [];
    const date = "\n<b>Дата</b>: " + getDate(new Date(announcement.date), true);
    const owner = announcement.owner == null ? "" : `\n<b>Власник</b>: <a href="tg://user?id=${announcement.owner.telegramId}">${announcement.owner.username}</a>`;
    const forRoles = announcement.roleIds.length === 0 ? "" : "\n<b>Ролі</b>: " + announcement.roleIds.map(id => allRoles.find(r => r.id === id)?.name ?? null).filter(e => e != null).join("; ");
    const forMembers = announcement.memberIds.length === 0 ? "" : "\n<b>Учасники</b>: " + announcement.memberIds.map(id => "#" + id).join("; ");
    const forUsers = announcement.userIds.length === 0 ? "" : "\n<b>Користувачі</b>: " + announcement.userIds.map(id => "#" + id).join("; ");
    const forLands = announcement.landIds.length === 0 ? "" : "\n<b>Осередки</b>: " + announcement.landIds.map(id => allLands.find(l => l.id === id)?.name ?? null).filter(e => e != null).join("; ");
    return `<u><b>⚙️Профіль: Панель Оголошень</b></u>\n${date}\n${owner}\n${forLands}${forRoles}${forMembers}${forUsers}`;
  },
  [
    [["❌Видалити", CONTROL.clear]],
    [["⬅️Назад", CONTROL.back]]
  ]
);

export const $announcementArchive = optionsField<StateType>(
  async state => {
    return "<u><b>⚙️Профіль: Панель Оголошень</b></u>\n\nТи справді хочеш видалити оголошення?\n\nВідновити його зможе лише технічна адміністрація цього бота!";
  },
  [
    [["❌Так, видалити!", CONTROL.next]],
    [["⬅️Назад", CONTROL.back]]
  ],
  async state => {
    const data = getLastCallback(state, $announcementArchive.btn);
    if(data !== CONTROL.next) return;
    const announcement = state.data.options["announcements:current"] as Announcement;
    const res = await setAnnouncementStatus(announcement.id, "archive");
  }
);

export const $announcementArchived = optionsField<StateType>(
  async state => {
    return "<u><b>⚙️Профіль: Панель Оголошень</b></u>\n\nОголошення видалено!";
  },
  [
    [["⬅️Меню оголошень", CONTROL.back]]
  ],
  async state => {
    state.data.crums.pop();
    state.data.crums.pop();
    state.data.crums.pop();
  }
);

$annouceEditInput.chain.func(call($announcementEdit.proc));