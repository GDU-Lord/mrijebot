import { User } from "../../app/entities/user.entity.js";
import { procedure } from "../../core/chain.js";
import { LocalState } from "../../core/state.js";

export function initState(force: boolean = false) {
  return async (state: LocalState) => {
    if(typeof state.data !== "object" || force) state.data = {
      crums: [],
      land: "none",
      user: null,
      userIndex: null,
      options: {},
      storage: {
        user: null // User
      }
    };
  };
}

export interface StateType {

  crums: procedure[];
  land: string;
  user: any; // not in use
  userIndex: number; // not in use
  options: {
    [key: string]: any;
  };
  storage: {
    user: User | null;
  }

}