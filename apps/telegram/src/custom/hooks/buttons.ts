import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import { optionsGenerator } from "../../core/actions.js";
import getId from "../../core/id.js";
import { LocalState } from "../../core/state.js";
import InputInfoCache from "../inputInfoCache.js";
import { getInputInfo } from "../listeners.js";

export type key = [string, any];
export type row = key[];
export type keyboard = row[];
export interface buttonsGenerator {
  get: optionsGenerator;
  tag: string;
};

export function createButtons<LocalData = any, UserData = any>(keys: keyboard | ((state: LocalState<LocalData, UserData>) => Promise<keyboard>)): buttonsGenerator {
  const tagId = getId();
  return {
    get: async function (state) {
      if(state == null) return {};
      const keyboard = (typeof keys === "function" ? await keys(state) : keys).map(row => row.map(key => {
        const cache = new InputInfoCache(state, key[1]);
        const text = key[0];
        return {
          text,
          callback_data: [tagId, cache.id].join(":")
        }
      }));
      return {
        reply_markup: {
          inline_keyboard: keyboard
        },
        parse_mode: "HTML"
      };
    }, 
    tag: tagId
  }
}

export function buttonCallbackValue<data = any>(filter: any, buttons: buttonsGenerator): (data: any) => boolean {
  return buttonCallback<data>(data => data === filter, buttons);
}

export function buttonCallbackArray<data = any>(filter: any, buttons: buttonsGenerator): (data: any) => boolean {
  return buttonCallback<data>(data => filter.includes(data), buttons);
}

export function buttonCallbackExceptValue<data = any>(filter: any, buttons: buttonsGenerator): (data: any) => boolean {
  return buttonCallback<data>(data => data !== filter, buttons);
}

export function buttonCallbackExceptArray<data = any>(filter: any, buttons: buttonsGenerator): (data: any) => boolean {
  return buttonCallback<data>(data => !filter.includes(data), buttons);
}

export function buttonCallback<data = any>(filter: ((data: data) => boolean), buttons: buttonsGenerator): (data: any) => boolean {
  return function(inp: CallbackQuery) {
    const [tag, id] = InputInfoCache.breakId(inp.data);
    if(tag !== buttons.tag) return false;
    const cache = InputInfoCache.get(inp.data);
    if(cache == null) return false;
    const [chatId, userId, threadId] = getInputInfo("callback_query", inp);
    const localState = cache.state;
    if(localState == null) return false;
    if(localState.core.chatId !== chatId || localState.core.userId !== userId) return false;
    return filter(cache.data);
  }
}

export function getLastCallback<data = any>(state: LocalState, buttons: buttonsGenerator) {
  const inp = state.lastInput as TelegramBot.CallbackQuery;
  const [tag, id] = InputInfoCache.breakId(inp.data);
  if(tag !== buttons.tag) return null;
  const cache = InputInfoCache.get(inp.data);
  if(cache == null) return false;
  const [chatId, userId, threadId] = getInputInfo("callback_query", inp);
  const localState = cache.state;
  if(localState == null) return null;
  if(localState.core.chatId !== chatId || localState.core.userId !== userId) return false;
  return cache.data as data;
}

export function getLastData(state: LocalState) {
  const inp = state.lastInput as CallbackQuery;
  return InputInfoCache.get(inp.data);
}