import { getLocalRoles } from "../../../../api/role";
import { LocalState } from "../../../../core/state";
import { StateType } from "../../../../custom/hooks/state";

export async function updateLocalRoles(state: LocalState<StateType>) {
  state.data.options["admin:localRoles"] = await getLocalRoles();
}