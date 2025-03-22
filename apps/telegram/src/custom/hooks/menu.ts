import { procedure } from "../../core/chain.js";
import { LocalState } from "../../core/state.js";
import { initState } from "./state.js";

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
