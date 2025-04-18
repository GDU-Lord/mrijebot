import TelegramBot from "node-telegram-bot-api";
import { Land, User } from "../../../../core/src/entities";
import { api, getLand, getUserByTelegram, getUserMemberships } from "../../api";
import { Bot } from "../../core";
import { CHAIN } from "../../core/actions";
import { procedure } from "../../core/chain";
import { addChat, editChat, getChatByChatId } from "../../api/chat";
import { editLast } from "../../custom/hooks/messageOptions";
import { indexUsers } from "./indexusers";

export const $setchat = procedure();
$setchat.make()
  .send(async state => {
    state.data = {};
    const chatId = String(state.core.chatId);
    state.data.currentChat = await getChatByChatId(chatId);
    const chat = await Bot.getChat(chatId);
    if(chat?.type !== "group" && chat?.type !== "supergroup")
      return ["Це не груповий чат!", CHAIN.NEXT_LISTENER];
    const user = state.data.user = await getUserByTelegram(state.core.userId);
    if(!user)
      return ["Ти не зареєстрований!\n\n/setchat - щоб спробувати знову", CHAIN.NEXT_LISTENER];
    return [`Введи ID свого Осередку!${ state.data.currentChat ? " Поточне значення: " + (state.data.currentChat.land?.id ?? "/common") : "" }\n\n/common - для чату, що прив'язаний до Осередку\n/cancel - щоб скасувати`, CHAIN.NEXT_ACTION];
  })
  .input("setchat:landId", true)
  .send(async state => {
    const user = state.data.user as User;
    const idQuery = state.core.inputs["setchat:landId"]?.text ?? "/cancel";
    if(idQuery.startsWith("/cancel"))
      return ["Команду скасовано!", CHAIN.NEXT_LISTENER];
    if(idQuery.startsWith("/common")) {
      if(!user.globalRoles?.find(r => r.tag === "supervisor"))
        return ["Відмовлено в доступі!\n\n/setchat - щоб спробувати знову", CHAIN.NEXT_LISTENER];
    }
    else {
      const id = +(idQuery);
      const land = state.data.land = await getLand(id);
      if(!land)
        return ["Землю не знайдено!\n\n/setchat - щоб спробувати знову", CHAIN.NEXT_LISTENER];
      if(!user.globalRoles?.find(r => r.tag === "supervisor")) {
        const { participant } = await getUserMemberships(user);
        const membership = participant.find(p => p.land.id === land.id);
        if(!membership || membership.member.localRoles?.find(r => r.tag === "local_admin"))
          return ["Відмовлено в доступі!\n\n/setchat - щоб спробувати знову", CHAIN.NEXT_LISTENER];
      }
    }
    return [`Введи назву групи!${ state.data.currentChat ? " Поточне значення: " + state.data.currentChat.title : "" }\n\n/cancel - щоб скасувати`, CHAIN.NEXT_ACTION];
  }, {}, editLast())
  .input("setchat:title", true)
  .send(async state => {
    const query = state.core.inputs["setchat:title"]?.text ?? "/cancel";
    if(query.startsWith("/cancel"))
      return ["Команду скасовано!", CHAIN.NEXT_LISTENER];
    return `Введи запрошувальне посилання (з вимогою підтвердження запитів адміністратором)!${ state.data.currentChat ? " Поточне значення: " + state.data.currentChat.invite : "" }\n\n/cancel - щоб скасувати`;
  }, {}, editLast())
  .input("setchat:invite", true)
  .send(async state => {
    const query = state.core.inputs["setchat:invite"]?.text ?? "/cancel";
    if(query.startsWith("/cancel"))
      return ["Команду скасовано!", CHAIN.NEXT_LISTENER];
    const landId = +state.core.inputs["setchat:landId"]?.text!;
    const land = state.data.land as Land | null;
    const title = state.core.inputs["setchat:title"]?.text!;
    const invite = state.core.inputs["setchat:invite"]?.text!;
    let res = false;
    if(!state.data.currentChat)
      res = await addChat(String(state.core.chatId), title, invite, !land ? null : landId);
    else
      res = await editChat(state.data.currentChat.id as number, String(state.core.chatId), title, invite, !land ? null : landId);
    const status = !land ? "чат не прив'язаний Осередку" : `чат Осередку "${land?.name}"`;
    if(!res)
      return ["Помилка!\n\n/setchat - щоб спробувати знову", CHAIN.NEXT_LISTENER];
    await indexUsers();
    return [`Групу додано до системи як ${status}!\n\nЩоб від'єднати чат, виключіть цього бота з групи.`, CHAIN.NEXT_ACTION];
  }, {}, editLast());