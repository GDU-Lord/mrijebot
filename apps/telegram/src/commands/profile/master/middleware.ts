import { UserDurationPreference } from "../../../../../core/src/entities";
import { getUser, setMasterPreferences } from "../../../api";
import { forAllFields } from "../../../api/convert-fields";
import { LocalState } from "../../../core/state";
import { clearOptions, setInputOptionsList } from "../../../custom/hooks/inputs";
import { StateType } from "../../../custom/hooks/state";

export async function savePrefs(state: LocalState<StateType>, prefs: {
  systemsPreferred?: number[];
  customSystemsPreferred?: string[];
  systemsPlayed?: number[];
  customSystemsPlayed?: string[];
  duration?: UserDurationPreference[];
  gamesPlayed?: number;
}) {
  const user = state.data.storage.user;
  if(!user) return;
  await setMasterPreferences(
    user.id, 
    prefs.systemsPreferred ?? user.masterPreferredGameSystems.map(s => s.id),
    prefs.systemsPlayed ?? user.masterPlayedGameSystems.map(s => s.id),
    prefs.customSystemsPreferred ?? user.customMasterPreferredGameSystems,
    prefs.customSystemsPlayed ?? user.customMasterPlayedGameSystems,
    prefs.duration ?? user.masterPreferredDuration,
    prefs.gamesPlayed ?? user.masterGamesPlayed,
  );
  state.data.storage.user = await getUser(user.id);
}

export async function saveSystemsPreferred(state: LocalState<StateType>) {
  const systemsPreferred: number[] = [];
  const customSystemsPreferred: string[] = [];
  forAllFields(state, "masterPanel", "systemsPreferred", (index, value) => {
    if(!value) return;
    if(isNaN(+index)) return customSystemsPreferred.push(String(index));
    systemsPreferred.push(+index);
  });
  savePrefs(state, {
    systemsPreferred,
    customSystemsPreferred
  });
}

export async function saveSystemsPlayed(state: LocalState<StateType>) {
  const systemsPlayed: number[] = [];
  const customSystemsPlayed: string[] = [];
  forAllFields(state, "masterPanel", "systemsPlayed", (index, value) => {
    if(!value) return;
    if(isNaN(+index)) return customSystemsPlayed.push(String(index));
    systemsPlayed.push(+index);
  });
  await savePrefs(state, {
    systemsPlayed,
    customSystemsPlayed,
  });
}

export async function saveGamesPlayed(state: LocalState<StateType>) {
  await savePrefs(state, {
    gamesPlayed: state.data.options["masterPanel:gamesPlayed"]
  });
}

export async function saveDuration(state: LocalState<StateType>) {
  const duration: UserDurationPreference[] = [];
  forAllFields(state, "masterPanel", "gamesPreferred", (index, value) => {
    if(!value) return;
    duration.push(index);
  });
  await savePrefs(state, {
    duration
  });
}

export async function loadMasterPrefs(state: LocalState<StateType>) {
  const user = state.data.storage.user;
  if(!user) return;
  clearOptions(state, "masterPanel");
  setInputOptionsList(state, "masterPanel", "systemsPreferred", user.customMasterPreferredGameSystems);
  setInputOptionsList(state, "masterPanel", "systemsPreferred", user.masterPreferredGameSystems.map(s => s.id));
  setInputOptionsList(state, "masterPanel", "systemsPlayed", user.customMasterPlayedGameSystems);
  setInputOptionsList(state, "masterPanel", "systemsPlayed", user.masterPlayedGameSystems.map(s => s.id));
  setInputOptionsList(state, "masterPanel", "gamesPreferred", user.masterPreferredDuration);
  state.data.options["masterPanel:gamesPlayed"] = user.masterGamesPlayed;
  console.log(state.data.options);
}