import { UserDurationPreference } from "../../../../../core/src/entities";
import { getUser, setPlayerAspects, setPlayerMessages, setPlayerPreferences } from "../../../api";
import { forAllFields } from "../../../api/convert-fields";
import { LocalState } from "../../../core/state";
import { clearOptions, setInputOptionsList } from "../../../custom/hooks/inputs";
import { StateType } from "../../../custom/hooks/state";
import { text } from "../../form/validators";

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
  await setPlayerPreferences(
    user.id, 
    prefs.systemsPreferred ?? user.playerPreferredGameSystems.map(s => s.id),
    prefs.systemsPlayed ?? user.playerPlayedGameSystems.map(s => s.id),
    prefs.customSystemsPreferred ?? user.customPlayerPreferredGameSystems,
    prefs.customSystemsPlayed ?? user.customPlayerPlayedGameSystems,
    prefs.duration ?? user.playerPreferredDuration,
    prefs.gamesPlayed ?? user.playerGamesPlayed,
  );
  state.data.storage.user = await getUser(user.id);
}

export async function saveSystemsPreferred(state: LocalState<StateType>) {
  const systemsPreferred: number[] = [];
  const customSystemsPreferred: string[] = [];
  forAllFields(state, "playerPanel", "systemsPreferred", (index, value) => {
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
  forAllFields(state, "playerPanel", "systemsPlayed", (index, value) => {
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
    gamesPlayed: state.data.options["playerPanel:gamesPlayed"]
  });
}

export async function saveAspects(state: LocalState<StateType>) {
  const user = state.data.storage.user;
  if(!user) return;
  await setPlayerAspects(
    user.id,
    state.data.options["playerPanel:aspectFight"],
    state.data.options["playerPanel:aspectSocial"],
    state.data.options["playerPanel:aspectExplore"],
  );
  state.data.storage.user = await getUser(user.id);
}

export async function saveDuration(state: LocalState<StateType>) {
  const duration: UserDurationPreference[] = [];
  forAllFields(state, "playerPanel", "gamesPreferred", (index, value) => {
    if(!value) return;
    duration.push(index);
  });
  await savePrefs(state, {
    duration
  });
}

export async function saveMasterMessage(state: LocalState<StateType>) {
  const user = state.data.storage.user;
  if(!user) return;
  await setPlayerMessages(
    user.id,
    state.data.options["playerPanel:textForMaster"] ?? user.playerMasterMessage ?? "",
    user.playerTriggers ?? "",
  );
  state.data.storage.user = await getUser(user.id);
}

export async function saveTriggers(state: LocalState<StateType>) {
  const user = state.data.storage.user;
  if(!user) return;
  await setPlayerMessages(
    user.id,
    user.playerMasterMessage ?? "",
    state.data.options["playerPanel:triggers"] ?? user.playerTriggers ?? "",
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
  setInputOptionsList(state, "playerPanel", "gamesPreferred", user.playerPreferredDuration);
  state.data.options["playerPanel:gamesPlayed"] = user.playerGamesPlayed;
  state.data.options["playerPanel:aspectFight"] = user.playerAspectFight;
  state.data.options["playerPanel:aspectSocial"] = user.playerAspectSocial;
  state.data.options["playerPanel:aspectExplore"] = user.playerAspectExplore;
  state.data.options["playerPanel:textForMaster"] = user.playerMasterMessage;
  state.data.options["playerPanel:triggers"] = user.playerTriggers;
  console.log(state.data.options);
}