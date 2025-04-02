import { GameSystem, Land } from "../../../../core/src/entities";
import { Role } from "../../../../core/src/entities/role.entity";
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
        user: null,
        isWizard: false,
        lands: [],
        systems: [],
        roles: [],
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
    systems: GameSystem[];
    roles: Role[];
  }

}