import { api } from ".";
import { CreateRequestDto } from "../../../core/src/controllers/request/dtos/create-request.dto";
import { GetRequestsQuery } from "../../../core/src/controllers/request/queries/get-requests.query";
import { Land, Member } from "../../../core/src/entities";
import { Request, requestStatus } from "../../../core/src/entities/request.entity";
import { Role } from "../../../core/src/entities/role.entity";
import { User } from "../../../core/src/entities/user.entity";

export type requestSubject = {
  user?: User,
  member?: Member,
  role?: Role,
  land?: Land,
};

export async function createRequest(tag: string, entry: {
  from: requestSubject,
  to: requestSubject,
  signatures?: User[],
  content?: string,
}) {
  return await api.post("/requests", {
    tag,
    content: entry.content,
    fromLand: entry.from.land?.id,
    fromUser: entry.from.user?.id,
    fromRole: entry.from.role?.id,
    fromMember: entry.from.member?.id,
    toLand: entry.to.land?.id,
    toUser: entry.to.user?.id,
    toRole: entry.to.role?.id,
    toMember: entry.to.member?.id,
    signatures: entry.signatures?.map(u => u.id),
  } as CreateRequestDto, {}, err => console.log(err));
}

export async function getRequests(entry: {
  id?: number,
  tag?: string,
  from?: requestSubject,
  to?: requestSubject,
  content?: string,
  status?: string,
}) {
  return await api.get<Request[]>("/requests", {
    id: entry.id,
    tag: entry.tag,
    content: entry.content,
    status: entry.status,
    fromLandId: entry.from?.land?.id,
    fromUserId: entry.from?.user?.id,
    fromRoleId: entry.from?.role?.id,
    fromMemberId: entry.from?.member?.id,
    toLandId: entry.to?.land?.id,
    toUserId: entry.to?.user?.id,
    toRoleId: entry.to?.role?.id,
    toMemberId: entry.to?.member?.id,
  } as GetRequestsQuery, err => console.log(err));
}

export async function signRequest(id: number, user: User) {
  return await api.put(`/requests/${id}/sign/${user.id}`, {}, {}, err => console.log(err));
}

export async function setRequestStatus(id: number, status: requestStatus) {
  return await api.put(`/requests/${id}/status/${status}`, {}, {}, err => console.log(err));
}

export async function fulfillRequest(id: number, user: User) {
  const sign = await signRequest(id, user);
  const status = await setRequestStatus(id, "fulfilled");
  return sign && status;
}

export async function rejectRequest(id: number, user: User) {
  const sign = await signRequest(id, user);
  const status = await setRequestStatus(id, "rejected");
  return sign && status;
}