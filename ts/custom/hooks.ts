import { CallbackQuery, SendMessageOptions } from "node-telegram-bot-api";
import { optionsGenerator } from "../core/actions.js";
import InputInfoCache from "./inputInfoCache.js";
import { getInputInfo } from "./listeners.js";
import { LocalState } from "../core/state.js";
import getId from "../core/id.js";

export type key = [string, any];
export type row = key[];
export type keyboard = row[];
export interface buttonsGenerator {
  get: optionsGenerator;
  tag: string;
};

export function createButtons(keys: keyboard): buttonsGenerator {
  const tagId = getId();
  return {
    get: async function (state) {
      if(state == null) return {};
      const keyboard = keys.map(row => row.map(key => {
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
        }
      };
    }, 
    tag: tagId
  }
}

export function buttonCallback<data = any>(filter: (data: data) => boolean, buttons: buttonsGenerator) {
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

export function getLastData(state: LocalState) {
  const inp = state.lastInput as CallbackQuery;
  return InputInfoCache.get(inp.data);
}