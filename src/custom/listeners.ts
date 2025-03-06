import TelegramBot, { ChatId } from "node-telegram-bot-api";
import { inputType, on } from "../core/chain.js";
import { LocalState, UserState } from "../core/state.js";
import InputInfoCache from "./inputInfoCache.js";

export type availableInputTypes = TelegramBot.Message | TelegramBot.CallbackQuery;
export type availableEventTypes = "message" | "callback_query";

export function getInputInfo(type: "message", input: inputType): [ChatId, number | null, number];
export function getInputInfo(type: availableEventTypes, input: inputType): [ChatId | null, number | null, number];
export function getInputInfo(type: availableEventTypes, input: inputType): [ChatId | null, number | null, number] {
  if(type === "message") {
    const inp = input as TelegramBot.Message;
    return [inp.chat.id, inp.from?.id ?? null, inp.message_thread_id ?? -1];
  }
  if(type === "callback_query") {
    const inp = input as TelegramBot.CallbackQuery;
    const msg = inp.message;
    if(msg) {
      return [msg.chat.id, msg.chat.id ?? null, msg.message_thread_id ?? -1];
    }
    const cache = InputInfoCache.get(inp.data);
    if(cache == null) return [null, null, -1];
    return [cache.state.core.chatId, cache.state.core.userId, cache.state.core.threadId ?? -1];
  }
  return [null, null, -1];
}

export function getState(type: availableEventTypes, input: inputType): [UserState | null, LocalState | null] {
  const [chatId, userId, threadId] = getInputInfo(type, input);
  if(userId == null) return [null, null];
  let userState = UserState.list[userId];
  if(userState == null)
    userState = new UserState(userId);
  if(chatId == null) return [userState, null];
  let localState = userState.getLocalState(chatId, threadId);
  if(localState == null && userId != null)
    localState = new LocalState(chatId, threadId, userId);
  return [userState, localState];
}