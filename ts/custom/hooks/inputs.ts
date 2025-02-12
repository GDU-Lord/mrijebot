import { inputListener, Bot } from "../../core/index.js";
import { LocalState } from "../../core/state.js";

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

export function deleteLastInput(key: string) {
  return async (state: LocalState) => {
    try {
      await Bot.deleteMessage(state.core.chatId, state.core.inputs[key]?.message_id ?? -1);
    } catch {}
  }
}