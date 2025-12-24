import { getUserByTelegram } from "../../api";
import { getChatByChatId } from "../../api/chat";
import { Bot } from "../../core";
import { queueFunction } from "../../core/cooldown";
import { indexUsers } from "./indexusers";

export async function processChatRequest(chatId: number, telegamId: number) {

  const user = await getUserByTelegram(telegamId);

  if(!user) {
    await queueFunction(async () => await Bot.declineChatJoinRequest(chatId, telegamId));
    return;
  }

  const chat = await getChatByChatId(String(chatId));

  if(!chat) return;

  const landId = chat.land?.id;

  if(!landId) {
    await queueFunction(async () => await Bot.approveChatJoinRequest(chatId, telegamId));
    await indexUsers();
    return;
  }

  const member = user.memberships.find(m => m.landId === landId);

  if(member) {
    await queueFunction(async () => await Bot.approveChatJoinRequest(chatId, telegamId));
    await indexUsers();
    return;
  }

  await queueFunction(async () => await Bot.declineChatJoinRequest(chatId, telegamId));

}