import { getUserByTelegram } from "../../api";
import { getChatByChatId } from "../../api/chat";
import { Bot } from "../../core";
import { indexUsers } from "./indexusers";

export async function processChatRequest(chatId: number, telegamId: number) {

  const user = await getUserByTelegram(telegamId);

  if(!user) {
    await Bot.declineChatJoinRequest(chatId, telegamId);
    return;
  }

  const chat = await getChatByChatId(String(chatId));

  if(!chat) return;

  const landId = chat.land?.id;

  if(!landId) {
    await Bot.approveChatJoinRequest(chatId, telegamId);
    await indexUsers();
    return;
  }

  const member = user.memberships.find(m => m.landId === landId);

  if(member) {
    await Bot.approveChatJoinRequest(chatId, telegamId);
    await indexUsers();
    return;
  }

  await Bot.declineChatJoinRequest(chatId, telegamId);

}