import { CHAIN } from "../../core/actions";
import { on, procedure } from "../../core/chain";
import { LocalState } from "../../core/state";
import { buttonsGenerator, buttonCallbackValue, buttonCallbackArray, buttonCallbackExceptValue, buttonCallbackExceptArray } from "./buttons";
import { removeInputs } from "./inputs";
import { call } from "./menu";

export function routeCallback(buttons: buttonsGenerator, value: any, procedure: procedure, ...middleware: ((state: LocalState) => Promise<CHAIN | void>)[]) {
  return on("callback_query", buttonCallbackValue(value, buttons))
    .func(async (state) => {
      for(const m of middleware) {
        const r = await m(state);
        if(r === CHAIN.EXIT || r === CHAIN.NEXT_LISTENER)
          return r;
      }
    })
    .func(removeInputs()).func(call(procedure));
}

export function routeCallbackArray(buttons: buttonsGenerator, value: any[], procedure: procedure, ...middleware: ((state: LocalState) => Promise<CHAIN | void>)[]) {
  return on("callback_query", buttonCallbackArray(value, buttons))
    .func(async (state) => {
      for(const m of middleware) {
        const r = await m(state);
        if(r === CHAIN.EXIT || r === CHAIN.NEXT_LISTENER)
          return r;
      }
    })
    .func(removeInputs()).func(call(procedure));
}

export function routeCallbackExcept(buttons: buttonsGenerator, value: any, procedure: procedure, ...middleware: ((state: LocalState) => Promise<CHAIN | void>)[]) {
  return on("callback_query", buttonCallbackExceptValue(value, buttons))
    .func(async (state) => {
      for(const m of middleware) {
        const r = await m(state);
        if(r === CHAIN.EXIT || r === CHAIN.NEXT_LISTENER)
          return r;
      }
    })
    .func(removeInputs()).func(call(procedure));
}

export function routeCallbackExceptArray(buttons: buttonsGenerator, value: any[], procedure: procedure, ...middleware: ((state: LocalState) => Promise<CHAIN | void>)[]) {
  return on("callback_query", buttonCallbackExceptArray(value, buttons))
    .func(async (state) => {
      for(const m of middleware) {
        const r = await m(state);
        if(r === CHAIN.EXIT || r === CHAIN.NEXT_LISTENER)
          return r;
      }
    })
    .func(removeInputs()).func(call(procedure));
}

export function waitFor(procedure: procedure) {
  return async function(state: LocalState) {
    return await state.core.promises.promise[procedure.id];
  };
}