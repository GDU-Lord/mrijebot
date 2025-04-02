import { Request, requestStatus } from "../../../../../../core/src/entities/request.entity";
import { getUser } from "../../../../api";
import { fulfillRequest, getRequests, rejectRequest, requestSubject } from "../../../../api/request";
import { assignGlobalRole, getLocalRoles, removeGlobalRole } from "../../../../api/role";
import { CHAIN } from "../../../../core/actions";
import { LocalState } from "../../../../core/state";
import { StateType } from "../../../../custom/hooks/state";
import { CONTROL } from "../../../mapping";

export async function updateLocalRoles(state: LocalState<StateType>) {
  state.data.options["admin:localRoles"] = await getLocalRoles();
}

export async function queryRequests(tag: string, to: requestSubject = {}, from: requestSubject = {}, status: requestStatus | undefined = undefined) {
  console.log("qeury", to);
  return await getRequests({
    to,
    from,
    tag,
    status
  }) ?? [];
}

export async function processRequestAction(state: LocalState<StateType>) {
  const user = state.data.storage.user!;
  const request = state.data.options["admin:requestChosen"] as Request;
  const action = state.data.options["admin:requestAction"];
  switch(action) {
    case CONTROL.clear:
      if(!await rejectRequest(request.id, user)) return CHAIN.NEXT_LISTENER;
      break;
    case CONTROL.next:
      if(!await fulfillRequest(request.id, user)) return CHAIN.NEXT_LISTENER;
      break;
  }
  console.log("DO");  
  await processBecomeMaster(state);
}

export async function processBecomeMaster(state: LocalState<StateType>) {
  const request = state.data.options["admin:requestChosen"] as Request;
  const action = state.data.options["admin:requestAction"];
  if(request.tag !== "become_master") return;
  console.log("REQ");
  const user = await getUser(request.fromMember!.userId);
  const masterRequestRole = state.data.storage.roles.find(r => r.tag === "master_request");
  const masterRole = state.data.storage.roles.find(r => r.tag === "master");
  switch(action) {
    case CONTROL.clear:
      await removeGlobalRole(masterRequestRole!.id, user!.id);
      return;
    case CONTROL.next:
      await assignGlobalRole(masterRole!.id, user!.id);
      await removeGlobalRole(masterRequestRole!.id, user!.id);
      return;
  }
}