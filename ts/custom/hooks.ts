import TelegramBot, { CallbackQuery, SendMessageOptions } from "node-telegram-bot-api";
import { optionsGenerator } from "../core/actions.js";
import InputInfoCache from "./inputInfoCache.js";
import { getInputInfo } from "./listeners.js";
import { LocalState } from "../core/state.js";
import getId from "../core/id.js";
import { on, procedure } from "../core/chain.js";
import { Bot } from "../core/index.js";

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

export function buttonCallbackValue<data = any>(filter: any, buttons: buttonsGenerator): (data: any) => boolean {
  return buttonCallback<data>(data => data === filter, buttons);
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

export function initState() {
  return async (state: LocalState) => {
    if(typeof state.data !== "object") state.data = {
      crums: [],
      land: "none"
    };
  };
}

export function addCrum(crum: procedure) {
  return async (state: LocalState) => {
    state.data.crums.push(crum);
  };
}

export function removeCrum() {
  return async (state: LocalState) => {
    state.data.crums.pop();
  };
}

export function call(procedure: procedure) {
  return async (state: LocalState) => state.call(procedure);
}

export function match(text: string) {
  return (inp: TelegramBot.Message) => inp.text === text;
}

export function command(com: string) {
  return (inp: TelegramBot.Message) => inp.text!.startsWith(com);
}

export function routeCallback(buttons: buttonsGenerator, value: any, procedure: procedure) {
  return on("callback_query", buttonCallbackValue(value, buttons)).func(call(procedure));
}

export function menuProcedure(procedure: procedure) {
  return procedure.make()
    .func(initState())
    .func(addCrum(procedure))
    .func(async state => {
      try {
        Bot.deleteMessage(state.core.chatId, state.lastMessageSent.message_id);
      } catch {}
    });
}