import { Chat } from "../../../../core/src/entities/chat.entity";
import { User } from "../../../../core/src/entities/user.entity";
import { getUsersGroups } from "../../api";
import { addChatUser, getAllChats, removeChatUser } from "../../api/chat";
import { Bot } from "../../core";
import { queueFunction } from "../../core/cooldown";

export async function indexUsers() {
  
  const users = await getUsersGroups();
  const chats = await getAllChats();

  if(!users || !chats) return;

  for(const user of users) {
    await indexUser(user, chats);
  }

}

export async function indexUser(user: User, chats: Chat[]) {

  for(const chat of chats) {

    try {
      const chatMember = await queueFunction(async () => await Bot.getChatMember(chat.chatId, +user.telegramId));
      if(chatMember.status === "kicked") {
        await queueFunction(async () => await Bot.unbanChatMember(chat.chatId, +user.telegramId));
        continue;
      }
      if(chatMember.status === "left") {
        await removeUserFromChat(chat, user);
        continue;
      }
      if(!chat.users.find(u => u.id === user.id))
        await addChatUser(chat.id, user.id);
      else if(chat.land && !user.memberships.find(m => m.landId === chat.land?.id && m.status !== "suspended")) {
        try {
          await queueFunction(async () => await Bot.banChatMember(chat.chatId, +user.telegramId));
          await queueFunction(async () => await Bot.unbanChatMember(chat.chatId, +user.telegramId));
        } catch (err) {}
        try {
          await removeUserFromChat(chat, user);
        } catch (err) {}
        continue;
      }
      await setUserRoles(user, chat);
    } catch {
      try {
        await removeUserFromChat(chat, user);
      } catch (err) {}
    }

  }

}

export async function removeUserFromChat(chat: Chat, user: User) {
  if(chat.users.find(u => u.id === user.id))
    return await removeChatUser(chat.id, user.id);
  return false;
}

export async function setUserRoles(user: User, chat: Chat) {

  const member = user.memberships.find(m => m.landId === chat.land?.id);
  const roles: string[] = [];

  for(const role of user.globalRoles ?? []) {
    const name = role.shortName ?? role.name?.[0] ?? role.tag[0];
    if(!roles.includes(name))
      roles.push(name);
  }

  for(const role of member?.localRoles ?? []) {
    const name = role.shortName ?? role.name?.[0] ?? role.tag[0];
    if(!roles.includes(name))
      roles.push(name);
  }

  const isAdmin = !!member?.localRoles?.find(r => r.tag === "local_mod" || r.tag === "local_admin");

  const status = member?.status === "guest" ? "Гість" : member?.status === "participant" ? "Учасник" : "*";
  const title = roles.length === 0 ? status : roles.sort().join(",");

  try {
    if(!isAdmin)
      await queueFunction(async () => await Bot.promoteChatMember(chat.chatId, +user.telegramId, {
        can_pin_messages: true,
      }));
    else
      await queueFunction(async () => await Bot.promoteChatMember(chat.chatId, +user.telegramId, {
        can_change_info: true,
        can_delete_messages: true,
        can_edit_messages: true,
        can_invite_users: true,
        can_manage_chat: true,
        can_manage_topics: true,
        can_manage_video_chats: true,
        can_pin_messages: true,
        can_post_messages: true,
        can_promote_members: false,
        can_restrict_members: false,
        is_anonymous: false,
      }));
    await queueFunction(async () => await Bot.setChatAdministratorCustomTitle(chat.chatId, +user.telegramId, title));
  } catch(err) {}

}