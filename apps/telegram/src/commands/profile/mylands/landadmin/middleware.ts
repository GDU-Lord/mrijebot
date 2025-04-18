import { Announcement } from "../../../../../../core/src/entities/announcement.entity";
import { Request, requestStatus } from "../../../../../../core/src/entities/request.entity";
import { createAnnouncement, getUser, setAnnouncementStatus } from "../../../../api";
import { fulfillRequest, getRequests, rejectRequest, requestSubject } from "../../../../api/request";
import { assignGlobalRole, getLocalRoles, removeGlobalRole } from "../../../../api/role";
import { Bot } from "../../../../core";
import { CHAIN } from "../../../../core/actions";
import { LocalState } from "../../../../core/state";
import { StateType } from "../../../../custom/hooks/state";
import { CONTROL } from "../../../mapping";

export async function updateLocalRoles(state: LocalState<StateType>) {
  state.data.options["admin:localRoles"] = await getLocalRoles();
}

export async function queryRequests(tag: string, to: requestSubject = {}, from: requestSubject = {}, status: requestStatus | undefined = undefined) {
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
  await processBecomeMaster(state);
}

export async function processBecomeMaster(state: LocalState<StateType>) {
  const request = state.data.options["admin:requestChosen"] as Request;
  const action = state.data.options["admin:requestAction"];
  if(request.tag !== "become_master") return;
  const user = await getUser(request.fromMember!.userId);
  const masterRequestRole = state.data.storage.roles.find(r => r.tag === "master_request");
  const masterRole = state.data.storage.roles.find(r => r.tag === "master");
  switch(action) {
    case CONTROL.clear: {
      await removeGlobalRole(masterRequestRole!.id, user!.id);
      const notification = await createAnnouncement("private", "#cистема\n\nТвій запит на статус Майстра було ВІДХИЛЕНО твоїм Осередком!", {
        userIds: [user!.id]
      });
      if(notification) await setAnnouncementStatus(notification.id, "pending");
      return;
    }
    case CONTROL.next: {
      await assignGlobalRole(masterRole!.id, user!.id);
      await removeGlobalRole(masterRequestRole!.id, user!.id);
      const notification = await createAnnouncement("private", "#cистема\n\nТвій запит на статус Майстра було ПІДТВЕРДЖЕНО твоїм Осередком!\n\nТепер тобі доступна Панель Майстра! Ознайомся з нею\n\nМРІЄБОТ > Профіль > Панель Майстра", {
        userIds: [user!.id]
      });
      if(notification) await setAnnouncementStatus(notification.id, "pending");
      return;
    }
  }
}

export async function prevPage(state: LocalState<StateType>) {
  const list = state.data.options["localAnnouncements:list"] as Announcement[];
  const pages = Math.ceil(list.length / 5);
  let current = (state.data.options["localAnnouncements:page"] ?? 1) - 1;
  if(current >= pages)
    current = 0;
  if(current < 0)
    current = pages-1;
  state.data.options["localAnnouncements:page"] = current;
}

export async function nextPage(state: LocalState<StateType>) {
  const list = state.data.options["localAnnouncements:list"] as Announcement[];
  const pages = Math.ceil(list.length / 5);
  let current = (state.data.options["localAnnouncements:page"] ?? -1) + 1;
  if(current >= pages)
    current = 0;
  if(current < 0)
    current = pages-1;
  state.data.options["localAnnouncements:page"] = current;
}

export async function getAnnouncement(state: LocalState<StateType>) {
  const id = state.data.options["localAnnouncements:currentId"] as number;
  state.data.options["localAnnouncements:current"] = state.data.options["localAnnouncements:list"].find((a: any) => a.id === id);
}