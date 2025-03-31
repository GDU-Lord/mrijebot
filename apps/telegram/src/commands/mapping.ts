export type MapOf<type extends string> = {
  [key in type]: type;
};

export type ArrayMapOf<keyType extends string, arrayType = unknown> = {
  [key in keyType]: arrayType[];
};

export const CONTROL: MapOf<"back" | "next" | "clear"> = {
  back: "back",
  next: "next",
  clear: "clear",
}

export const MENU: ArrayMapOf<"option", string> = {
  option: new Array(100).fill(0).map((v, i) => `option.${i}`)
}