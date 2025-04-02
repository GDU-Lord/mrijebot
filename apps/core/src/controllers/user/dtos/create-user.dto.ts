import { IsEmail, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";
import { UserDiscoverySource } from "../../../entities";

export class CreateUserDto {
  @IsInt()
  telegramId!: number;
  
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  username!: string | null;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  city!: string;

  @IsEnum(["instagram", "chat_bot", "community", "friends", "linked_in", "none"] as UserDiscoverySource[])
  discoverySource!: UserDiscoverySource;

  @IsInt()
  @Min(0)
  playerGamesPlayed!: number;
  
  @IsInt()
  @Min(0)
  masterGamesPlayed!: number;
}
