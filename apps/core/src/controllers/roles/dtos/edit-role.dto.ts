import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { roleStatus, roleType } from "../../../entities/role.entity";

export class EditRoleDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  tag!: string;

  @IsEnum(['local', 'global', 'hybrid'] as roleType[])
  type!: roleType;

  @IsEnum(['position', 'role'] as roleStatus[])
  status!: roleStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  publicName!: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  shortName!: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  shortPublicName!: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  link!: string | null;

  @IsOptional()
  @IsInt()
  rank!: number | null;

}
