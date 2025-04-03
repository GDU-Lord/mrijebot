import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsObject, IsOptional, IsPositive, IsString } from "class-validator";
import { announcementType } from "../../../entities/announcement.entity";

export class CreateAnnouncementDto {
  
  @IsEnum(["local", "global", "game", "private"] as announcementType[])
  tag!: announcementType;

  @IsOptional()
  @IsInt()
  @IsPositive()
  ownerId?: number;


  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  landIds?: number[] = [];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  roleIds?: number[] = [];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  userIds?: number[] = [];

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  memberIds?: number[] = [];


  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  text!: string;

}