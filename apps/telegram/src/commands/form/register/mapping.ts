import { UserDiscoverySource, UserDurationPreference } from "../../../../../core/src/entities";

export type MapOf<type extends string> = {
  [key in type]: type;
};

export const SOURCE: MapOf<UserDiscoverySource> = { 
  instagram: "instagram",
  linked_in: "linked_in",
  friends: "friends",
  chat_bot: "chat_bot",
  community: "community",
  none: "none",
}

export const PLAYED: MapOf<"has_experience" | "no_experience"> = {
  has_experience: "has_experience",
  no_experience: "no_experience",
}

export const GAME_TYPES: MapOf<UserDurationPreference> = {
  one_shot: "one_shot",
  short_campaign: "short_campaign",
  long_campaign: "long_campaign",
}

export const MASTERED: MapOf<"is_master" | "wants_master" | "no_master"> = {
  is_master: "is_master",
  wants_master: "wants_master",
  no_master: "no_master",
}