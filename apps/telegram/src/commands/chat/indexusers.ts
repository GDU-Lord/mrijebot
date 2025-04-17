import { Chat } from "../../../../core/src/entities/chat.entity";
import { User } from "../../../../core/src/entities/user.entity";
import { getUsersGroups } from "../../api";
import { addChatUser, getAllChats, removeChatUser } from "../../api/chat";
import { Bot } from "../../core";

export async function indexUsers() {
  
  const users = await getUsersGroups();
  const chats = await getAllChats();

  console.log(users);
  console.log(chats);

  if(!users || !chats) return;

  for(const user of users) {
    await indexUser(user, chats);
  }

}

export async function indexUser(user: User, chats: Chat[]) {

  for(const chat of chats) {

    try {
      const chatMember = await Bot.getChatMember(chat.chatId, +user.telegramId); 
      console.log("in chat", chatMember);
      if(chatMember.status === "kicked") {
        await Bot.unbanChatMember(chat.chatId, +user.telegramId);
        continue;
      }
      if(chatMember.status === "left") {
        await removeUserFromChat(chat, user);
        continue;
      }
      console.log(!chat.users.find(u => u.id === user.id), !!chat.land, !user.memberships.find(m => m.landId === chat.land?.id));
      if(!chat.users.find(u => u.id === user.id))
        await addChatUser(chat.id, user.id);
      else if(chat.land && !user.memberships.find(m => m.landId === chat.land?.id)) {
        console.log("BAN");
        try {
          console.log("BAN TG");
          await Bot.banChatMember(chat.chatId, +user.telegramId);
          await Bot.unbanChatMember(chat.chatId, +user.telegramId);
          console.log("BAN TG DONE");
        } catch (err) { console.log(1, err) }
        try {
          console.log("REM")
          await removeUserFromChat(chat, user);
          console.log("REM DONE");
        } catch (err) { console.log(2, err) }
        continue;
      }
      await setUserRoles(user, chat);
    } catch {
      console.log("not in chat", user, chat);
      try {
        await removeUserFromChat(chat, user);
      } catch (err) {
        console.log(3, err);
      }
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

  const status = member?.status === "guest" ? "Гість" : member?.status === "participant" ? "Учасник" : "*";
  const title = roles.length === 0 ? status : roles.sort().join("");

  try {
    await Bot.promoteChatMember(chat.chatId, +user.telegramId, {
      can_pin_messages: true,
    });
    await Bot.setChatAdministratorCustomTitle(chat.chatId, +user.telegramId, title);
    console.log(title);
  } catch(err) {
    console.log(err);
  }

}