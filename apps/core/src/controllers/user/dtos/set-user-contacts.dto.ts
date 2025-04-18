import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";
import { UserDiscoverySource } from "../../../entities";

export class SetUserContactsDto {

  @IsOptional()
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  city!: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  username!: string;

}
