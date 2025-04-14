import TelegramBot, { EditMessageTextOptions } from "node-telegram-bot-api";
import { Land, Member, User } from "../../core/src/entities";
import { Announcement } from "../../core/src/entities/announcement.entity";
import { api } from "./api";
import { Bot, defeaultMessageOptions } from "./init";
import { UpdateAnnouncementDto } from "../../core/src/controllers/announcement/dtos/update-announcement.dto";
import { awaitTimeout } from "./files";

export let cache: {
  userTelegramIds: Record<number, number>;
};

export function clearCache() {
  cache = {
    userTelegramIds: {},
  };
}

export async function cacheUserTelegramIds() {

  const data = await api.get<{ id: number, telegramId: string }[]>("/users/telegramIds") ?? [];

  for(const entry of data) {
    cache.userTelegramIds[entry.id] = +entry.telegramId;
  }

}

export async function pollPendingMessages() {

  clearCache();
  await cacheUserTelegramIds();
  const updates = await api.get<Announcement[]>("/announcements/updates");

  if(!updates || updates.length === 0) return;

  for(const upd of updates) {
    await processUpdate(upd);
  }

}
 
export async function processUpdate(update: Announcement) {

  const usersUpdated: number[] = [];

  if(update.status === "pending") {
    const list: ([number, number] | null)[] = [];
    for(const id of update.landIds)
      list.push(...await forwardToLand(id, update, usersUpdated));
    for(const id of update.memberIds)
      list.push(await forwardToMember(id, update, usersUpdated));
    for(const id of update.userIds)
      list.push(await forwardToTelegram(cache.userTelegramIds[id], update, usersUpdated));
    for(const id of update.roleIds)
      list.push(...await forwardToRole(id, update, usersUpdated));
    const instanceIds: string[] = [];
    const recepientIds: string[] = [];
    for(const entry of list) {
      if(!entry) continue;
      instanceIds.push(String(entry[0]));
      recepientIds.push(String(entry[1]));
    }
    await api.put("/announcements/" + update.id, {
      instanceIds,
      recepientIds,
      status: "sent",
    } as UpdateAnnouncementDto);
    return;
  }
  
  if(update.status === "edit") {
    const { instanceIds, recepientIds } = update;
    for(const i in instanceIds) {
      await updateToTelegram(+recepientIds[i], +instanceIds[i], update, usersUpdated);
    }
    await api.put("/announcements/" + update.id, {
      status: "sent",
    } as UpdateAnnouncementDto);
    return;
  }

  if(update.status === "archive") {
    const { instanceIds, recepientIds } = update;
    for(const i in instanceIds) {
      await removeFromTelegram(+recepientIds[i], +instanceIds[i], usersUpdated);
    }
    await api.put("/announcements/" + update.id, {
      status: "archived"
    } as UpdateAnnouncementDto);
    return;
  }

}

export async function forwardToLand(id: number, update: Announcement, usersUpdated: number[]): Promise<([number, number] | null)[]> {

  const land = await api.get<Land>("/lands/" + id);

  if(!land) return [];

  const list: ([number, number] | null)[] = [];

  for(const member of land.members) {
    list.push(await forwardToTelegram(cache.userTelegramIds[member.userId], update, usersUpdated));
  }

  return list;

}

export async function forwardToRole(id: number, update: Announcement, usersUpdated: number[]): Promise<([number, number] | null)[]> {

  const { members, users } = await api.get<{
    members: Member[],
    users: User[],
  }>("/roles/" + id + "/assignees") ?? { members: [], users: [] };

  if(!members && !users) return [];
   
  const list: ([number, number] | null)[] = [];

  for(const member of members)
    list.push(await forwardToMember(id, update, usersUpdated, member));
  for(const user of users)
    list.push(await forwardToTelegram(cache.userTelegramIds[user.id], update, usersUpdated));

  return list;

}

export async function forwardToMember(id: number, update: Announcement, usersUpdated: number[], member?: Member | null): Promise<[number, number] | null> {

  if(!member) member = await api.get<Member>("/lands/member/" + id);

  if(!member) return null;

  return await forwardToTelegram(cache.userTelegramIds[member.userId], update, usersUpdated);

}

export async function forwardToTelegram(telegramId: number, update: Announcement, usersUpdated: number[]): Promise<[number, number] | null> {

  if(usersUpdated.includes(telegramId)) return null;

  let msgId: number | null;

  if(update.data?.photo) {
    msgId = await sendPhoto(telegramId, update.text, update.data.photo.id);
  }
  else
    msgId = await sendMessage(telegramId, update.text);

  if(!msgId) return null;

  usersUpdated.push(telegramId);

  return [msgId, telegramId];

}

export async function updateToTelegram(telegramId: number, messageId: number, update: Announcement, usersUpdated: number[]): Promise<boolean> {

  if(usersUpdated.includes(telegramId)) return false;

  const res = await editMessage(telegramId, messageId, update.text);

  if(!res) return false;

  usersUpdated.push(telegramId);
  
  return res;

}

export async function removeFromTelegram(telegramId: number, messageId: number, usersUpdated: number[]): Promise<boolean> {

  if(usersUpdated.includes(telegramId)) return false;

  const res = await deleteMessage(telegramId, messageId);

  if(!res) return false;

  usersUpdated.push(telegramId);
  
  return res;

}

export async function sendMessage(chatId: number, text: string, options: TelegramBot.SendMessageOptions = {}) {
  try { 
    const msg = await Bot.sendMessage(chatId, text, {...defeaultMessageOptions, ...options});
    return msg.message_id;
  } catch {
    return null;
  }
}

export async function sendPhoto(chatId: number, text: string, photo: string, options: TelegramBot.SendMessageOptions = {}) {
  try {
    const msg = await Bot.sendPhoto(chatId, photo, {...defeaultMessageOptions, ...options, caption: text });
    return msg?.message_id ?? null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function editMessage(chat_id: number, message_id: number, text: string, options: TelegramBot.SendMessageOptions = {}) {
  try {
    const msg = await Bot.editMessageText(text, {
      message_id,
      chat_id,
      ...(defeaultMessageOptions as EditMessageTextOptions), 
      ...(options as EditMessageTextOptions)
    });
    return !!msg;
  } catch(err) {
    try {
      const cpt = await Bot.editMessageCaption(text, {
        message_id,
        chat_id,
        ...(defeaultMessageOptions as EditMessageTextOptions), 
        ...(options as EditMessageTextOptions)
      });
      return !!cpt;
    } catch {
      return false;
    }
  }
}

export async function deleteMessage(chat_id: number, message_id: number) {
  try {
    return await Bot.deleteMessage(chat_id, message_id);
  } catch {
    return false;
  }
}