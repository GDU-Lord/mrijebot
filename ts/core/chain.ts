import TelegramBot, { Message, CallbackQuery } from "node-telegram-bot-api";
import { On, OnBot, Procedure } from "./on.js";
import { Action, CHAIN, Check, CheckNest, Func, FuncCase, optionsGenerator, Send, SendCase, UserInput, UserInputCase } from "./actions.js";
import { LocalState } from "./state.js";
import getId from "./id.js";
import { availableEventTypes, availableInputTypes } from "../custom/listeners.js";


type send = <localData = any, userData = any>(text: string | ((state: LocalState<localData, userData>) => Promise<string>), options?: TelegramBot.SendMessageOptions | optionsGenerator) => on;
type sendCase = <localData = any, userData = any, caseType = any>(match: caseType, text: string | ((state: LocalState<localData, userData>) => Promise<string>), options?: TelegramBot.SendMessageOptions | optionsGenerator) => onCheck;
type func = <localData = any, userData = any>(callback: (state: LocalState<localData, userData>) => Promise<CHAIN | void>) => on;
type funcCase = <localData = any, userData = any, caseType = any>(match: caseType, callback: (state: LocalState<localData, userData>) => Promise<CHAIN | void>) => onCheck;
type check = <localData = any, userData = any, resType = any>(callback: (state: LocalState<localData, userData>) => Promise<resType>) => onCheck;
type checkNest = <localData = any, userData = any, resType = any, caseType = any>(match: caseType, callback: (state: LocalState<localData, userData>) => Promise<resType>) => onCheck;
type input = <localData = any, userData = any>(key: string) => on;
type inputCase = <t = any>(match: t, key: string) => onCheck;

export interface procedure {
  make: () => on;
  clear: (state: LocalState) => void;
  id: string;
};

export interface on {
  send: send;
  func: func;
  check: check;
  input: input;
}

export interface onCheck {
  sendCase: sendCase;
  funcCase: funcCase;
  checkNest: checkNest;
  inputCase: inputCase;
  endCase: on;
  endNest: onCheck;
}

type last = on | onCheck;
export type inputType = availableInputTypes;

class Binder<Type extends (On | Action<any>), lastType extends last> {
  constructor(
    public chain: Type,
    public last: lastType
  ) {}
}

export const inputCase: inputCase = function<t = any>(this: Binder<Check, onCheck>, match: t, key: string): onCheck {
  const inp = {} as any;
  const chain = new UserInputCase(this.chain, key, match);
  const binder = new Binder<UserInputCase, onCheck>(chain, inp);
  inp.sendCase = sendCase.bind(binder);
  inp.funcCase = funcCase.bind(binder);
  inp.checkNest = checkNest.bind(binder);
  inp.inputCase = inputCase.bind(binder);
  inp.endCase = this.last.endCase;
  inp.endNest = this.last.endNest;
  return inp;
}

export const checkNest: checkNest = function<localData = any, userData = any, resType = any, t = any>(this: Binder<Check, onCheck>, match: t, callback: (state: LocalState<localData, userData>) => Promise<resType>): onCheck {
  const check = {} as any;
  const chain = new CheckNest(this.chain, match, callback);
  const binder = new Binder<CheckNest, onCheck>(chain, check);
  check.sendCase = sendCase.bind(binder);
  check.funcCase = funcCase.bind(binder);
  check.inputCase = inputCase.bind(binder);
  check.endCase = this.last;
  check.endNest = this.last;
  return check;
}

export const funcCase: funcCase = function<localData = any, userData = any, t = any>(this: Binder<Check, onCheck>, match: t, callback: (state: LocalState<localData, userData>) => Promise<CHAIN | void>) {
  new FuncCase<localData, userData>(this.chain, match, callback);
  return this.last;
}

export const sendCase: sendCase = function<localData = any, userData = any, t = any> (this: Binder<Check, onCheck>, match: t, text: string | ((state: LocalState<localData, userData>) => Promise<string>), options: TelegramBot.SendMessageOptions | optionsGenerator = {}) {
  new SendCase(this.chain, match, text, options);
  return this.last;
}

export const input: input = function<localData = any, userData = any>(this: Binder<On | UserInput, on>, key: string) {
  const inp = {} as on;
  const chain = new UserInput(key, this.chain);
  const binder = new Binder<UserInput, on>(chain, inp);
  inp.send = send.bind(binder);
  inp.func = func.bind(binder);
  inp.check = check.bind(binder);
  inp.input = input.bind(binder);
  return inp;
}

export const check: check = function<localData = any, userData = any, resType = any>(this: Binder<On, on>, callback: (state: LocalState<localData, userData>) => Promise<resType>): onCheck {
  const check = {} as onCheck;
  const chain = new Check(callback, this.chain);
  const binder = new Binder<Check, onCheck>(chain, check);
  check.sendCase = sendCase.bind(binder);
  check.funcCase = funcCase.bind(binder);
  check.inputCase = inputCase.bind(binder);
  check.checkNest = checkNest.bind(binder);
  check.endCase = this.last;
  return check;
}

export const func: func = function<localData = any, userData = any>(this: Binder<On | UserInput, on>, callback: (state: LocalState<localData, userData>) => Promise<CHAIN | void>) {
  this.chain.actions.push(new Func<localData, userData>(callback, this.chain));
  return this.last;
}

export const send: send = function<localData = any, userData = any> (this: Binder<On, on>, text: string | ((state: LocalState<localData, userData>) => Promise<string>), options: TelegramBot.SendMessageOptions | optionsGenerator = {}) {
  this.chain.actions.push(new Send<localData, userData>(text, options, this.chain));
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
  last.check = check.bind(binder);
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
    last.check = check.bind(binder);
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