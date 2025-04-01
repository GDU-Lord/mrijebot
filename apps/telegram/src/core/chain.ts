import TelegramBot, { Message, CallbackQuery } from "node-telegram-bot-api";
import { On, OnBot, Procedure } from "./on";
import { Action, CHAIN, Func, optionsGenerator, Send, UserInput } from "./actions";
import { LocalState } from "./state";
import getId from "./id";
import { availableEventTypes, availableInputTypes } from "../custom/listeners";


type send = <localData = any, userData = any>(text: string | ((state: LocalState<localData, userData>) => Promise<string | [string, CHAIN]>), options?: TelegramBot.SendMessageOptions | optionsGenerator, message_id?: number | ((state: LocalState<localData, userData>) => Promise<number>) | null) => on;
type func = <localData = any, userData = any>(callback: (state: LocalState<localData, userData>) => Promise<CHAIN | void>) => on;
type input = <localData = any, userData = any>(key: string, remove?: boolean) => on;

export interface procedure {
  make: () => on;
  clear: (state: LocalState) => void;
  id: string;
};

export interface on {
  send: send;
  func: func;
  input: input;
}

type last = on;
export type inputType = availableInputTypes;

class Binder<Type extends (On | Action<any>), lastType extends last> {
  constructor(
    public chain: Type,
    public last: lastType
  ) {}
}

export const input: input = function<localData = any, userData = any>(this: Binder<On | UserInput, on>, key: string, remove: boolean = false) {
  const inp = {} as on;
  const chain = new UserInput(key, remove, this.chain);
  const binder = new Binder<UserInput, on>(chain, inp);
  inp.send = send.bind(binder);
  inp.func = func.bind(binder);
  inp.input = input.bind(binder);
  return inp;
}

export const func: func = function<localData = any, userData = any>(this: Binder<On | UserInput, on>, callback: (state: LocalState<localData, userData>) => Promise<CHAIN | void>) {
  this.chain.actions.push(new Func<localData, userData>(callback, this.chain));
  return this.last;
}

export const send: send = function<localData = any, userData = any> (this: Binder<On, on>, text: string | ((state: LocalState<localData, userData>) => Promise<string | [string, CHAIN]>), options: TelegramBot.SendMessageOptions | optionsGenerator = {}, message_id: number | ((state: LocalState<localData, userData>) => Promise<number>) | null = null) {
  this.chain.actions.push(new Send<localData, userData>(text, options, this.chain, message_id));
  return this.last;
}

export function on<Input extends inputType = Message>(type: "message", filter: (inp: Input) => boolean): on;
export function on<Input extends inputType = CallbackQuery>(type: "callback_query", filter: (inp: Input) => boolean): on;
export function on<Input extends inputType>(type: availableEventTypes, filter: (inp: Input) => boolean): on {
  const chain = new OnBot(type, filter);
  const last: any = {};
  const binder = new Binder<On, on>(chain, last);
  last.send = send.bind(binder);
  last.func = func.bind(binder);
  last.input = input.bind(binder);
  return last;
}

export function procedure(filter?: (text: string) => boolean): procedure {
  const id = getId();
  function make(): on {
    const chain = new Procedure(id, filter ?? ((text) => text === id));
    const last: any = {};
    const binder = new Binder<On, on>(chain, last);
    last.send = send.bind(binder);
    last.func = func.bind(binder);
    last.input = input.bind(binder);
    return last;
  }
  function clear(state: LocalState) {
    state.core.procedures[id] = [];
  }
  return {
    id,
    make,
    clear
  }
}