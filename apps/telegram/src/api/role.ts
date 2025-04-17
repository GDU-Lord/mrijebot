import { api } from ".";
import { CreateRoleDto } from "../../../core/src/controllers/roles/dtos/create-role.dto";
import { EditRoleDto } from "../../../core/src/controllers/roles/dtos/edit-role.dto";
import { Member, User } from "../../../core/src/entities";
import { Role, roleStatus, roleType } from "../../../core/src/entities/role.entity";
import { indexUsers } from "../commands/chat/indexusers";

export async function createRole(tag: string, type: roleType, status: roleStatus) {
  return await api.post(`/roles/${type}/${status}`, { tag } as CreateRoleDto, {}, err => console.log(err));
}

export async function getGlobalRoles() {
  return await api.get<Role[]>(`/roles/global`, {}, err => console.log(err));
}

export async function getLocalRoles() {
  return await api.get<Role[]>(`/roles/local`, {}, err => console.log(err));
}

export async function getAllRoles() {
  return await api.get<Role[]>(`/roles/all`, {}, err => console.log(err));
}

export async function editRole(id: number, body: EditRoleDto) {
  const res = await api.put(`/roles/${id}`, body, {}, err => console.log(err));
  await indexUsers();
  return res;
}

export async function deleteRole(id: number) {
  const res = await api.delete(`/roles/${id}`, {}, err => console.log(err));
  await indexUsers();
  return res;
}

export async function getMemberRoles(id: number) {
  return await api.get(`/roles/member/${id}`, {}, err => console.log(err));
}

export async function assignLocalRole(roleId: number, memberId: number) {
  const res = await api.put(`/roles/${roleId}/member/${memberId}`, {}, {}, err => console.log(err));
  await indexUsers();
  return res;
}

export async function assignGlobalRole(roleId: number, userId: number) {
  const res = await api.put(`/roles/${roleId}/user/${userId}`, {}, {}, err => console.log(err));
  await indexUsers();
  return res;
}

export async function removeLocalRole(roleId: number, memberId: number) {
  const res = await api.delete(`/roles/${roleId}/member/${memberId}`, {}, err => console.log(err));
  await indexUsers();
  return res;
}

export async function removeGlobalRole(roleId: number, userId: number) {
  const res = await api.delete(`/roles/${roleId}/user/${userId}`, {}, err => console.log(err));
  await indexUsers();
  return res;
}

export async function getRoleAssignees(roleId: number) {
  return await api.get<{
    users: User[];
    members: Member[];
  }>(`/roles/${roleId}/assignees`, {}, err => console.log(err));
}