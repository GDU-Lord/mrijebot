import { GameSystem, UserDiscoverySource, UserDurationPreference } from "../../../entities";

export type CreateUserParams = {
  email: string;
  city: string;
  discoverySource: UserDiscoverySource;
  playerGamesPlayed: number;
  masterGamesPlayed: number;
  playerPreferredGameSystems: GameSystem[];
  playerPreferredDuration: UserDurationPreference[];
  masterPreferredGameSystems: GameSystem[];
  masterPreferredDuration: UserDurationPreference[];
}

export type CreateUserOptions = {
  email!: string;
  isGlobalAdmin!: boolean;
  memberships!: Member[];
  city!: string;
  discoverySource!: UserDiscoverySource;
  playerGamesPlayed!: number;
  playerPreferredGameSystems!: GameSystem[];
  playerPreferredDuration!: UserDurationPreference;
  masterGamesPlayed!: number;
  masterPreferredGameSystems!: GameSystem[];
  masterPreferredDuration!: UserDurationPreference | null;
}
