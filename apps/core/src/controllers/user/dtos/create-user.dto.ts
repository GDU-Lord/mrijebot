import { IsEmail, IsEnum, IsInt, IsString, MaxLength, Min, MinLength } from "class-validator";
import { UserDiscoverySource } from "../../../entities";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  city!: string;

  @IsEnum(['telegram', 'email'])
  discoverySource!: UserDiscoverySource;

  @IsInt()
  @Min(0)
  playerGamesPlayed!: number;
  
  @IsInt()
  @Min(0)
  masterGamesPlayed!: number;
}
