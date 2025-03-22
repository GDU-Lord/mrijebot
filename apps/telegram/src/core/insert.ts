import { LocalState } from "./state";

export function getBottom<T extends { [key: string]: any }> (o: T, path: string[]) {
  const fragment = path.shift() as string;
  if(fragment == null) return o;
  return getBottom(o[fragment], path);
}

export function insertText(state: LocalState, text: string) {
  let res = text;
  const match = text.match(/\{[0-9A-Za-z\.]{1,}\}/g);
  match?.forEach((key) => {
    key = key.slice(1, key.length-1);
    res = res.replaceAll(`{${key}}`, String(getBottom(state, key.split(".")) ?? ""));
  });
  return res;
}

// export function insertOptions(state: LocalState, options: )