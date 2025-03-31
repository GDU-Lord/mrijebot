import { IsInt, IsPositive, IsEnum, IsString, MinLength, MaxLength, Min, Max } from "class-validator";
import { UserDurationPreference } from "../../../entities";

export class SetPlayerMessagesDto {

  @IsString()
  playerMasterMessage!: string;

  @IsString()
  playerTriggers!: string;

} 