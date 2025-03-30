import { getUser, setPlayerPreferences } from "../../../api";
import { forAllFields } from "../../../api/convert-fields";
import { LocalState } from "../../../core/state";
import { clearOptions, setInputOptionsList } from "../../../custom/hooks/inputs";
import { StateType } from "../../../custom/hooks/state";
import { text } from "../../form/validators";

export async function savePreferredSystems(state: LocalState<StateType>) {
  const user = state.data.storage.user;
  if(!user) return;
  const systemsPreferred: number[] = [];
  const customSystemsPreferred: string[] = [];
  forAllFields(state, "playerPanel", "systemsPreferred", (index, value) => {
    if(!value) return;
    if(isNaN(+index)) return customSystemsPreferred.push(String(index));
    systemsPreferred.push(+index);
  });
  await setPlayerPreferences(
    user.id, 
    systemsPreferred,
    user.playerPlayedGameSystems.map(s => s.id), 
    customSystemsPreferred,
    user.customPlayerPlayedGameSystems,
    user.playerPreferredDuration
  );
  state.data.storage.user = await getUser(user.id);
}

export async function savePlayedSystems(state: LocalState<StateType>) {
  const user = state.data.storage.user;
  if(!user) return;
  const systemsPlayed: number[] = [];
  const customSystemsPlayed: string[] = [];
  forAllFields(state, "playerPanel", "systemsPlayed", (index, value) => {
    if(!value) return;
    if(isNaN(+index)) return customSystemsPlayed.push(String(index));
    systemsPlayed.push(+index);
  });
  await setPlayerPreferences(
    user.id,
    user.playerPreferredGameSystems.map(s => s.id),
    systemsPlayed,
    user.customPlayerPlayedGameSystems,
    customSystemsPlayed,
    user.playerPreferredDuration
  );
  state.data.storage.user = await getUser(user.id);
}

export async function loadPlayerPrefs(state: LocalState<StateType>) {
  const user = state.data.storage.user;
  if(!user) return;
  clearOptions(state, "playerPanel");
  setInputOptionsList(state, "playerPanel", "systemsPreferred", user.customPlayerPreferredGameSystems);
  setInputOptionsList(state, "playerPanel", "systemsPreferred", user.playerPreferredGameSystems.map(s => s.id));
  setInputOptionsList(state, "playerPanel", "systemsPlayed", user.customPlayerPlayedGameSystems);
  setInputOptionsList(state, "playerPanel", "systemsPlayed", user.playerPlayedGameSystems.map(s => s.id));
  console.log(state.data.options);
}