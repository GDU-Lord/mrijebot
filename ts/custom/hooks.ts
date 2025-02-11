import TelegramBot, { CallbackQuery, SendMessageOptions } from "node-telegram-bot-api";
import { optionsGenerator } from "../core/actions.js";
import InputInfoCache from "./inputInfoCache.js";
import { getInputInfo } from "./listeners.js";
import { LocalState } from "../core/state.js";
import getId from "../core/id.js";
import { on, procedure } from "../core/chain.js";
import { Bot, inputListener } from "../core/index.js";

export type key = [string, any];
export type row = key[];
export type keyboard = row[];
export interface buttonsGenerator {
  get: optionsGenerator;
  tag: string;
};

export function createButtons(keys: keyboard | ((state: LocalState) => Promise<keyboard>)): buttonsGenerator {
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

export function initState(force: boolean = false) {
  return async (state: LocalState) => {
    if(typeof state.data !== "object" || force) state.data = {
      crums: [],
      land: "none",
      user: null,
      userIndex: null,
      options: {}
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

export function noRepeatCrum(crum: procedure) {
  return async (state: LocalState) => {
    if(state.data.crums[state.data.crums.length-1] === crum)
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

export function removeInputs() {
  return async (state: LocalState) => {
    console.log("remove inputs");
    const indices: number[] = [];
    inputListener.promises.forEach(([_state, res], index) => {
      if(_state === state) {
        res(null);
        indices.push(index);
      }
    });
    for(const index of indices)
      inputListener.promises.splice(index, 1);
    console.log(inputListener.promises);
  }
}

export function routeCallback(buttons: buttonsGenerator, value: any, procedure: procedure) {
  return on("callback_query", buttonCallbackValue(value, buttons))
    .func(removeInputs()).func(call(procedure));
}

export function routeCallbackArray(buttons: buttonsGenerator, value: any[], procedure: procedure) {
  return on("callback_query", buttonCallbackArray(value, buttons))
    .func(removeInputs()).func(call(procedure));
}

export function routeCallbackExcept(buttons: buttonsGenerator, value: any, procedure: procedure) {
  return on("callback_query", buttonCallbackExceptValue(value, buttons))
    .func(removeInputs()).func(call(procedure));
}

export function routeCallbackExceptArray(buttons: buttonsGenerator, value: any[], procedure: procedure) {
  return on("callback_query", buttonCallbackExceptArray(value, buttons))
    .func(removeInputs()).func(call(procedure));
}

export function menuProcedure(procedure: procedure) {
  return procedure.make()
    .func(initState())
    .func(addCrum(procedure))
    .func(async state => {
      // try {
      //   Bot.deleteMessage(state.core.chatId, state.lastMessageSent.message_id);
      // } catch {}
    });
}

export function deleteLastInput(key: string) {
  return async (state: LocalState) => {
    try {
      await Bot.deleteMessage(state.core.chatId, state.core.inputs[key]?.message_id ?? -1);
    } catch {}
  }
}

export function editLast() {
  return async (state: LocalState) => {
    return state.lastMessageSent?.message_id;
  };
}

export function saveValue(key: string, ...exclude: any[]) {
  return async (state: LocalState, buttons: buttonsGenerator) => {
    const data = getLastCallback(state, buttons);
    if(exclude.includes(data)) return;
    state.data.options[key] = data;
  }
}

export function toggleValue(key: string, ...exclude: any[]) {
  return async (state: LocalState, buttons: buttonsGenerator) => {
    const data = getLastCallback(state, buttons);
    if(exclude.includes(data)) return;
    state.data.options[`${key}:${data}`] = !state.data.options[`${key}:${data}`];
  }
}

export function toggleValueInput(key: string, ...exclude: any[]) {
  return async (state: LocalState, input: string) => {
    if(exclude.includes(input)) return;
    state.data.options[`${key}:${input}`] = !state.data.options[`${key}:${input}`];
  }
}

export function toggleButtons(key: string, buttons: keyboard, statusTrue: string, statusFalse: string, ...exclude: any[]) {
  return async (state: LocalState) => {
    return buttons.map(row => row.map(button => {
      let name = button[0];
      const data = button[1];
      const status = !!state.data.options[`${key}:${data}`];
      name = (status ? statusTrue : statusFalse) + name;
      return [name, data] as [string, any];
    }))
  };
}