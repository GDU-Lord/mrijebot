import { LocalState } from "../../core/state";
import { buttonsGenerator, getLastCallback, keyboard } from "./buttons";

export function saveValue<LocalData extends { options: { [key: string]: any } } = any, UserData = any>(key: string, ...exclude: any[]) {
  return async (state: LocalState<LocalData, UserData>, buttons: buttonsGenerator) => {
    const data = getLastCallback(state, buttons);
    if(exclude.includes(data)) return;
    state.data.options[key] = data;
  }
}

export function saveValueInput<LocalData extends { options: { [key: string]: any } } = any, UserData = any>(key: string) {
  return async (state: LocalState<LocalData, UserData>, input: string) => {
    state.data.options[key] = input;
  }
}

export function toggleValue<LocalData extends { options: { [key: string]: any } } = any, UserData = any>(key: string, ...exclude: any[]) {
  return async (state: LocalState<LocalData, UserData>, buttons: buttonsGenerator) => {
    const data = getLastCallback(state, buttons);
    if(exclude.includes(data)) return;
    state.data.options[`${key}:${data}`] = !state.data.options[`${key}:${data}`];
  }
}

export function toggleValueInput<LocalData extends { options: { [key: string]: any } } = any, UserData = any>(key: string, ...exclude: any[]) {
  return async (state: LocalState<LocalData, UserData>, input: string) => {
    if(exclude.includes(input)) return;
    state.data.options[`${key}:${input}`] = !state.data.options[`${key}:${input}`];
    console.log("INP", key, input, state.data.options[`${key}:${input}`]);
  }
}

export function toggleButtons<LocalData extends { options: { [key: string]: any } } = any, UserData = any>(key: string, buttons: keyboard | ((state: LocalState<LocalData, UserData>) => Promise<keyboard>), statusTrue: string, statusFalse: string, ...exclude: any[]) {
  return async (state: LocalState<LocalData, UserData>) => {
    let _buttons: keyboard;
    if(typeof buttons === "function") _buttons = await buttons(state);
    else _buttons = buttons;
    return _buttons.map(row => row.map(button => {
      let name = button[0];
      const data = button[1];
      const status = !!state.data.options[`${key}:${data}`];
      name = (status ? statusTrue : statusFalse) + name;
      return [name, data] as [string, any];
    }));
  };
}