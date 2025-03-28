import { IsInt, IsPositive, IsEnum, IsString, MinLength, MaxLength } from "class-validator";
import { UserDurationPreference } from "../../../entities";

export class SetUserPreferencesDto {
  @IsInt({ each: true })
  @IsPositive({ each: true })
  gameSystemIds!: number[];

  @IsInt({ each: true })
  @IsPositive({ each: true })
  gameSystemPlayedIds!: number[];

  @IsString({ each: true })
  @MinLength(3, { each: true })
  @MaxLength(255, { each: true })
  customSystems!: string[];

  @IsString({ each: true })
  @MinLength(3, { each: true })
  @MaxLength(255, { each: true })
  customSystemsPlayed!: string[];

  @IsEnum(['one_shot', 'short_campaign', 'long_campaign'], { each: true })
  durations!: UserDurationPreference[];
} 