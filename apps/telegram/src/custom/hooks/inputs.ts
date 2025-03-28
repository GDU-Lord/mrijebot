import { inputListener, Bot } from "../../core/index";
import { LocalState } from "../../core/state";

export function removeInputs() {
  return async (state: LocalState) => {
    const indices: number[] = [];
    inputListener.promises.forEach(([_state, res], index) => {
      if(_state === state) {
        res(null);
        indices.push(index);
      }
    });
    for(const index of indices)
      inputListener.promises.splice(index, 1);
  }
}

export function deleteLastInput(key: string) {
  return async (state: LocalState) => {
    try {
      await Bot.deleteMessage(state.core.chatId, state.core.inputs[key]?.message_id ?? -1);
    } catch {}
  }
}

export function getInputOptionsList(state: LocalState, part: string, field: string, validator: (input: string) => boolean) {
  const list: string[] = [];
  for(const i in state.data.options) {
    const [_part, _field, ...rest] = i.split(":");
    const value = rest.join(":");
    const status = state.data.options[i];
    if(_part === part && _field === field && validator(value) && status)
      list.push(value);
  }
  return list;
}