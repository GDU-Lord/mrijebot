import * as api from "../api";
import { LocalState } from "../core/state";
import { StateType } from "../custom/hooks/state";
import { setUserData } from "./profile/mydata/utils";

export async function loadUser(state: LocalState<StateType>) {
  state.data.storage.roles = await api.getAllRoles() ?? [];
  state.data.storage.lands = await api.getLands() ?? [];
  let user = state.data.storage.user = await api.getUserByTelegram(state.core.userId);
  const telegramUser = state.lastInput.from;
  const username = telegramUser?.username ? `@${telegramUser.username}` : telegramUser?.first_name ?? null;
  if(!user) return;
  if(username && username !== user.username) {
    const res = await setUserData(user.id, "username", username);
    if(res) state.data.storage.user = await api.getUserByTelegram(state.core.userId);
  }
}