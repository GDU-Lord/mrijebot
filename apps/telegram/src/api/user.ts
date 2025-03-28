import { MemberStatus, User, UserDiscoverySource, UserDurationPreference } from "../../../core/src/entities";
import { CreateUserDto } from "../../../core/src/controllers/user/dtos/create-user.dto";
import { api } from ".";
import { JoinLandDto, SetUserPreferencesDto } from "../../../core/src/controllers/user/dtos";

export async function getUserByTelegram(telegramId: number) {
  return await api.get<User>(`/users/byTelegramId/${telegramId}`);
}

export async function getUser(userId: number) {
  return await api.get<User>(`/users/${userId}`);
}

export async function createUser(
  telegramId: number,
  email: string,
  discoverySource: UserDiscoverySource,
  city: string,
  playerGamesPlayed: number,
  masterGamesPlayed: number,
) {
  const data: CreateUserDto = {
    email,
    city,
    discoverySource,
    playerGamesPlayed,
    masterGamesPlayed,
    telegramId,
  };
  const res = await api.post("/users", data);
  if(!res) return null;
  return await getUserByTelegram(telegramId);
}

export async function setPlayerPreferences(
  userId: number,
  gameSystemIds: number[],
  gameSystemPlayedIds: number[],
  customSystems: string[],
  customSystemsPlayed: string[],
  durations: UserDurationPreference[],
) {
  const data: SetUserPreferencesDto = {
    gameSystemIds,
    gameSystemPlayedIds,
    customSystems,
    customSystemsPlayed,
    durations,
  };
  return await api.put(`/users/${userId}/preferences/player`, data, {}, err => console.log(err));
}

export async function setMasterPreferences(
  userId: number,
  gameSystemIds: number[],
  gameSystemPlayedIds: number[],
  customSystems: string[],
  customSystemsPlayed: string[],
  durations: UserDurationPreference[],
) {
  const data: SetUserPreferencesDto = {
    gameSystemIds,
    gameSystemPlayedIds,
    customSystems,
    customSystemsPlayed,
    durations,
  };
  return await api.put(`/users/${userId}/preferences/master`, data, {}, err => console.log(err));
}

export async function joinLand(
  userId: number,
  landId: number,
  status: MemberStatus,
) {
  const data: JoinLandDto = {
    landId,
    status,
  };
  return await api.post(`/users/${userId}/memberships`, data, {}, err => console.log(err));
}

export async function leaveLand(
  userId: number,
  landId: number,
) {
  return await api.delete(`/users/${userId}/memberships/${landId}`, {}, err => console.log(err));
}