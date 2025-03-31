import { IsInt, IsPositive, IsEnum, IsString, MinLength, MaxLength, Min, Max } from "class-validator";
import { UserDurationPreference } from "../../../entities";

export class SetPlayerAspectsDto {

  @IsInt()
  @Min(1)
  @Max(3)
  playerAspectFight!: number | null;

  @IsInt()
  @Min(1)
  @Max(3)
  playerAspectSocial!: number | null;

  @IsInt()
  @Min(1)
  @Max(3)
  playerAspectExplore!: number | null;
  
} 