import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString, MaxLength, Min, MinLength } from "class-validator";
import { UserDiscoverySource } from "../../../entities";
import { roleStatus, roleType } from "../../../entities/role.entity";

export class CreateRoleDto {
  
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  tag!: string;

}
