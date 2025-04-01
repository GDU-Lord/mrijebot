import { api } from ".";
import { CreateRoleDto } from "../../../core/src/controllers/roles/dtos/create-role.dto";
import { EditRoleDto } from "../../../core/src/controllers/roles/dtos/edit-role.dto";
import { Role, roleStatus, roleType } from "../../../core/src/entities/role.entity";

export async function createRole(tag: string, type: roleType, status: roleStatus) {
  return await api.post(`/roles/${type}/${status}`, { tag } as CreateRoleDto, {}, err => console.log(err));
}

export async function getGlobalRoles() {
  return await api.get<Role[]>(`/roles/global`, {}, err => console.log(err));
}

export async function getAllRoles() {
  return await api.get<Role[]>(`/roles/all`, {}, err => console.log(err));
}

export async function editRole(id: number, body: EditRoleDto) {
  return await api.put(`/roles/${id}`, body, {}, err => console.log(err));
}

export async function deleteRole(id: number) {
  return await api.delete(`/roles/${id}`, {}, err => console.log(err));
}

export async function getMemberRoles(id: number) {
  return await api.get(`/roles/member/${id}`, {}, err => console.log(err));
}

export async function assignLocalRole(roleId: number, memberId: number) {
  return await api.put(`/roles/${roleId}/member/${memberId}`, {}, {}, err => console.log(err));
}

export async function assignGlobalRole(roleId: number, userId: number) {
  return await api.put(`/roles/${roleId}/user/${userId}`, {}, {}, err => console.log(err));
}

export async function removeLocalRole(roleId: number, memberId: number) {
  return await api.delete(`/roles/${roleId}/member/${memberId}`, {}, err => console.log(err));
}

export async function removeGlobalRole(roleId: number, userId: number) {
  return await api.delete(`/roles/${roleId}/user/${userId}`, {}, err => console.log(err));
}