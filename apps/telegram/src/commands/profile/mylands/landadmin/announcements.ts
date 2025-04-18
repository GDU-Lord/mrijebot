import { toHTML } from "@telegraf/entity";
import TelegramBot from "node-telegram-bot-api";
import { Announcement } from "../../../../../../core/src/entities/announcement.entity";
import { setAnnouncementText, setAnnouncementStatus, getAnnouncement, getLocalAnnouncements } from "../../../../api";
import { CHAIN } from "../../../../core/actions";
import { getLastCallback, keyboard } from "../../../../custom/hooks/buttons";
import { getDate } from "../../../../custom/hooks/date";
import { StateType } from "../../../../custom/hooks/state";
import { MENU, CONTROL } from "../../../mapping";
import { optionsField } from "../../../presets/options";
import { textField } from "../../../presets/textfield";
import { text } from "../../../presets/validators";
import { call } from "../../../../custom/hooks/menu";
import { saveValue } from "../../../../custom/hooks/options";
import { Land } from "../../../../../../core/src/entities";
import { isLocalMod } from "../../roles";
import { $start } from "../../../start";

export const $localAnnouncements = optionsField<StateType>(
  async state => {
    if(!await isLocalMod("profile:chosenLand")(state)) {
      state.call($start);
      return ["Помилка!", CHAIN.NEXT_LISTENER];
    }
    const land = state.data.options["profile:chosenLand"] as Land;
    const page = state.data.options["localAnnouncements:page"] = state.data.options["localAnnouncements:page"] ?? 0;
    return `<u><b>⚙️Адмінська Панель: Локальні Оголошення (${land.name})</b></u>\n\nОбери оголошення, щоб керувати ним\n\n<i>(Сторінка: ${page+1})</i>`;
  },
  async state => {
    const land = state.data.options["profile:chosenLand"] as Land;
    const announcements = state.data.options["localAnnouncements:list"] = await getLocalAnnouncements(land.id) ?? [];
    const page = state.data.options["localAnnouncements:page"];
    const list = announcements.slice(page * 5, (page + 1) * 5).map(a => {
      const date = new Date(a.date);
      const text = getDate(date);
      return [[text, a.id]];
    }) as keyboard;
    return [
      ...list,
      [["⬅️", MENU.option[0]], ["➡️", MENU.option[1]]],
      [["⬅️Назад", CONTROL.back]]
    ];
  },
  saveValue("localAnnouncements:currentId", MENU.option[0], MENU.option[1], CONTROL.back)
);

export const $localAnnouncement = optionsField<StateType>(
  async state => {
    if(!await isLocalMod("profile:chosenLand")(state)) {
      state.call($start);
      return ["Помилка!", CHAIN.NEXT_LISTENER];
    }
    const land = state.data.options["profile:chosenLand"] as Land;
    const text = state.data.options["localAnnouncements:current"]?.text as string;
    return `<u><b>⚙️Адмінська Панель: Локальні Оголошення (${land.name})</b></u>\n\n${text}`;
  },
  [
    [["ℹ️ Метадані", MENU.option[0]]],
    [["🖊️Змінити текст", MENU.option[1]]],
    [["⬅️Назад", CONTROL.back]],
  ]
);

export const $localAnnouceEditInput = textField(
  "localAnnouncements:editText",
  async state => {
    if(!await isLocalMod("profile:chosenLand")(state)) {
      state.call($start);
      return ["Помилка!", CHAIN.NEXT_LISTENER];
    }
    const land = state.data.options["profile:chosenLand"] as Land;
    return `<u><b>⚙️Адмінська Панель: Локальні Оголошення (${land.name})</b></u>\n\nВведи новий текст оголошення (попередній текст буде втрачено!):`;
  },
  text(Infinity)
);

export const $localAnnouncementEdit = optionsField<StateType>(
  async state => {
    if(!await isLocalMod("profile:chosenLand")(state)) {
      state.call($start);
      return ["Помилка!", CHAIN.NEXT_LISTENER];
    }
    const land = state.data.options["profile:chosenLand"] as Land;
    const msg = state.core.inputs["localAnnouncements:editText"] as TelegramBot.Message;
    const announcement = state.data.options["localAnnouncements:current"] as Announcement;
    const html = toHTML({
      text: msg.text ?? msg.caption as any,
      entities: msg.entities ?? msg.caption_entities as any
    });

    if(html === announcement.text) {
      return `<u><b>⚙️Адмінська Панель: Локальні Оголошення (${land.name})</b></u>\n\nТекст оголошення оновлено!`;
    }

    const res = await setAnnouncementText(announcement.id, html);
    
    if(!res) return ["<u><b>⚙️Адмінська Панель: Локальні Оголошення (${land.name})</b></u>\n\nПомилка оновлення оголошення!", CHAIN.NEXT_LISTENER];
    
    const { id } = state.data.options["localAnnouncements:current"] as Announcement;
    state.data.options["localAnnouncements:current"] = await getAnnouncement(id);

    return `<u><b>⚙️Адмінська Панель: Локальні Оголошення (${land.name})</b></u>\n\nТекст оголошення оновлено!`;
  },
  [
    [["⬅️Назад", CONTROL.back]]
  ],
  async state => {
    state.data.crums.pop();
  }
);

export const $localAnnouncementMeta = optionsField<StateType>(
  async state => {
    if(!await isLocalMod("profile:chosenLand")(state)) {
      state.call($start);
      return ["Помилка!", CHAIN.NEXT_LISTENER];
    }
    const land = state.data.options["profile:chosenLand"] as Land;
    const announcement = state.data.options["localAnnouncements:current"] as Announcement;
    const allRoles = state.data.storage.roles ?? [];
    const allLands = state.data.storage.lands ?? [];
    const date = "\n<b>Дата</b>: " + getDate(new Date(announcement.date), true);
    const owner = announcement.owner == null ? "" : `\n<b>Власник</b>: <a href="tg://user?id=${announcement.owner.telegramId}">${announcement.owner.username}</a>`;
    const forRoles = announcement.roleIds.length === 0 ? "" : "\n<b>Ролі</b>: " + announcement.roleIds.map(id => allRoles.find(r => r.id === id)?.name ?? null).filter(e => e != null).join("; ");
    const forMembers = announcement.memberIds.length === 0 ? "" : "\n<b>Учасники</b>: " + announcement.memberIds.map(id => "#" + id).join("; ");
    const forUsers = announcement.userIds.length === 0 ? "" : "\n<b>Користувачі</b>: " + announcement.userIds.map(id => "#" + id).join("; ");
    const forLands = announcement.landIds.length === 0 ? "" : "\n<b>Осередки</b>: " + announcement.landIds.map(id => allLands.find(l => l.id === id)?.name ?? null).filter(e => e != null).join("; ");
    return `<u><b>⚙️Адмінська Панель: Локальні Оголошення (${land.name})</b></u>\n${date}\n${owner}\n${forLands}${forRoles}${forMembers}${forUsers}`;
  },
  [
    [["❌Видалити", CONTROL.clear]],
    [["⬅️Назад", CONTROL.back]]
  ]
);

export const $localAnnouncementArchive = optionsField<StateType>(
  async state => {
    if(!await isLocalMod("profile:chosenLand")(state)) {
      state.call($start);
      return ["Помилка!", CHAIN.NEXT_LISTENER];
    }
    const land = state.data.options["profile:chosenLand"] as Land;
    return `<u><b>⚙️Адмінська Панель: Локальні Оголошення (${land.name})</b></u>\n\nТи справді хочеш видалити оголошення?\n\nВідновити його зможе лише технічна адміністрація цього бота!`;
  },
  [
    [["❌Так, видалити!", CONTROL.next]],
    [["⬅️Назад", CONTROL.back]]
  ],
  async state => {
    if(!await isLocalMod("profile:chosenLand")(state)) {
      state.call($start);
      return CHAIN.NEXT_LISTENER;
    }
    const data = getLastCallback(state, $localAnnouncementArchive.btn);
    if(data !== CONTROL.next) return;
    const announcement = state.data.options["localAnnouncements:current"] as Announcement;
    const res = await setAnnouncementStatus(announcement.id, "archive");
    console.log(res);
  }
);

export const $localAnnouncementArchived = optionsField<StateType>(
  async state => {
    const land = state.data.options["profile:chosenLand"] as Land;
    return `<u><b>⚙️Адмінська Панель: Локальні Оголошення (${land.name})</b></u>\n\nОголошення видалено!`;
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

$localAnnouceEditInput.chain.func(call($localAnnouncementEdit.proc));