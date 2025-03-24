import { Land } from "../../../../core/src/entities";
import { User } from "../../../../core/src/entities/user.entity";
import { procedure } from "../../core/chain";
import { LocalState } from "../../core/state";

export function initState(force: boolean = false) {
  return async (state: LocalState<StateType>) => {
    if(typeof state.data !== "object" || force) state.data = {
      crums: [],
      land: "none",
      options: {},
      storage: {
        user: null, // User
        isWizard: false,
        lands: []
      }
    };
  };
}

export interface StateType {

  crums: procedure[];
  land: string;
  options: {
    [key: string]: any;
  };
  storage: {
    user: User | null;
    isWizard: boolean;
    lands: Land[];
  }

}