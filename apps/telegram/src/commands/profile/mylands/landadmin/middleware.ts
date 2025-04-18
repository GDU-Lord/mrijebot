import { Announcement } from "../../../../../../core/src/entities/announcement.entity";
import { Request, requestStatus } from "../../../../../../core/src/entities/request.entity";
import { Role } from "../../../../../../core/src/entities/role.entity";
import { createAnnouncement, getUser, joinLand, leaveLand, setAnnouncementStatus } from "../../../../api";
import { createRequest, fulfillRequest, getRequests, rejectRequest, requestSubject } from "../../../../api/request";
import { assignGlobalRole, getLocalRoles, getRoleAssignees, removeGlobalRole } from "../../../../api/role";
import { Bot } from "../../../../core";
import { CHAIN } from "../../../../core/actions";
import { LocalState } from "../../../../core/state";
import { StateType } from "../../../../custom/hooks/state";
import { indexUsers } from "../../../chat/indexusers";
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
  await processMoveOut(state);
  await processMoveIn(state);
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

export async function processMoveOut(state: LocalState<StateType>) {
  const request = state.data.options["admin:requestChosen"] as Request;
  const action = state.data.options["admin:requestAction"];
  if(request.tag !== "move_out") return;
  const user = await getUser(request.fromMember!.userId);
  if(!user) return;
  const suspendedRole = state.data.storage.roles.find(r => r.tag === "suspended");
  if(!suspendedRole) return;
  switch(action) {
    case CONTROL.clear: {
      await removeGlobalRole(suspendedRole!.id, user.id);
      const notification = await createAnnouncement("private", "#cистема\n\nТвій запит на зміну Основного Осередку було ВІДХИЛЕНО твоїм Осередком!", {
        userIds: [user.id]
      });
      if(notification) await setAnnouncementStatus(notification.id, "pending");
      return;
    }
    case CONTROL.next: {
      const localAdminRole = state.data.storage.roles.find(r => r.tag === "local_admin");
      if(!localAdminRole) return;
      const res = await createRequest("move_in", {
        from: { user },
        to: {
          role: localAdminRole
        },
        content: request.content!
      });
      if(!res) return;
      let { members } = await getRoleAssignees(localAdminRole.id) ?? {};
      members = members?.filter(m => m.landId === +request.content!);
      const notification = await createAnnouncement("private", `#система\n\nКористувач стати Учасником твого Осередку!\n\nПерейди у <b>МРІЄБОТ > Профіль > Мої Осередки > [ТВІЙ ОСЕРЕДОК] > Запити</b>`, {
        memberIds: members?.map(m => m.id)
      });
      if(notification) await setAnnouncementStatus(notification.id, "pending");
    }
  }
}

export async function processMoveIn(state: LocalState<StateType>) {
  const request = state.data.options["admin:requestChosen"] as Request;
  const action = state.data.options["admin:requestAction"];
  if(request.tag !== "move_in") return;
  const user = await getUser(request.fromUser!.id);
  if(!user) return;
  const suspendedRole = state.data.storage.roles.find(r => r.tag === "suspended");
  if(!suspendedRole) return;
  switch(action) {
    case CONTROL.clear: {
      await removeGlobalRole(suspendedRole!.id, user.id);
      const notification = await createAnnouncement("private", "#cистема\n\nТвій запит на зміну Основного Осередку було ВІДХИЛЕНО цільовим Осередком!", {
        userIds: [user.id]
      });
      if(notification) await setAnnouncementStatus(notification.id, "pending");
      return;
    }
    case CONTROL.next: {
      const originLandId = user.memberships.find(m => m.status === "participant")?.landId;
      if(!originLandId) return;
      const left = await leaveLand(user.id, originLandId);
      if(!left) return;
      const joined = await joinLand(user.id, +request.content!, "participant");
      if(!joined) return;
      await removeGlobalRole(suspendedRole!.id, user.id);
      const notification = await createAnnouncement("private", "#cистема\n\nТвій запит на зміну Основного Осередку ПРИЙНЯТО!\n\nДію твого акаунту відновлено! Ти все ще можеш стати Гостем свого попереднього Осередку :)", {
        userIds: [user.id]
      });
      if(notification) await setAnnouncementStatus(notification.id, "pending");
      await indexUsers();
    }
  }
}

export async function announcementsPprevPage(state: LocalState<StateType>) {
  const list = state.data.options["localAnnouncements:list"] as Announcement[];
  const pages = Math.ceil(list.length / 5);
  let current = (state.data.options["localAnnouncements:page"] ?? 1) - 1;
  if(current >= pages)
    current = 0;
  if(current < 0)
    current = pages-1;
  state.data.options["localAnnouncements:page"] = current;
}

export async function announcementsNextPage(state: LocalState<StateType>) {
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

export async function requestsPrevPage(state: LocalState<StateType>) {
  const list = state.data.options["admin:requestsList"] as Announcement[];
  const pages = Math.ceil(list.length / 5);
  let current = (state.data.options["admin:requestsPage"] ?? 1) - 1;
  if(current >= pages)
    current = 0;
  if(current < 0)
    current = pages-1;
  state.data.options["admin:requestsPage"] = current;
}

export async function requestsNextPage(state: LocalState<StateType>) {
  const list = state.data.options["admin:requestsList"] as Announcement[];
  const pages = Math.ceil(list.length / 5);
  let current = (state.data.options["admin:requestsPage"] ?? -1) + 1;
  if(current >= pages)
    current = 0;
  if(current < 0)
    current = pages-1;
  state.data.options["admin:requestsPage"] = current;
}