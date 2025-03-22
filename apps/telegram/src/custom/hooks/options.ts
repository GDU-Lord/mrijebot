import { LocalState } from "../../core/state";
import { buttonsGenerator, getLastCallback, keyboard } from "./buttons";

export function saveValue(key: string, ...exclude: any[]) {
  return async (state: LocalState, buttons: buttonsGenerator) => {
    const data = getLastCallback(state, buttons);
    if(exclude.includes(data)) return;
    state.data.options[key] = data;
  }
}

export function saveValueInput(key: string) {
  return async (state: LocalState, input: string) => {
    state.data.options[key] = input;
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