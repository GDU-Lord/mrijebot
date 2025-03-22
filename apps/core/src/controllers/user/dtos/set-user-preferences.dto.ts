import { IsInt, IsPositive, IsEnum } from "class-validator";
import { UserDurationPreference } from "../../../entities";

export class SetUserPreferencesDto {
  @IsInt({ each: true })
  @IsPositive({ each: true })
  gameSystemIds: number[];

  @IsEnum(['one_shot', 'short_campaign', 'long_campaign'], { each: true })
  durations: UserDurationPreference[];
} 