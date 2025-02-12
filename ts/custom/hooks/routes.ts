import { on, procedure } from "../../core/chain.js";
import { buttonsGenerator, buttonCallbackValue, buttonCallbackArray, buttonCallbackExceptValue, buttonCallbackExceptArray } from "./buttons.js";
import { removeInputs } from "./inputs.js";
import { call } from "./menu.js";

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