import { LocalState } from "../../core/state.js";

export function initState(force: boolean = false) {
  return async (state: LocalState) => {
    if(typeof state.data !== "object" || force) state.data = {
      crums: [],
      land: "none",
      user: null,
      userIndex: null,
      options: {}
    };
  };
}
