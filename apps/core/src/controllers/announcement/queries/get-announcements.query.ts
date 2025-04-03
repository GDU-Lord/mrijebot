import { IsEnum, IsOptional, IsInt, IsPositive, IsDateString } from "class-validator";
import { announcementStatus, announcementType } from "../../../entities/announcement.entity";
import { Type } from "class-transformer";

export class GetAnnouncementsQuery {
  
  @IsOptional()
  @IsEnum(["local", "global", "game", "private"] as announcementType[])
  tag?: announcementType;
  
  @IsOptional()
  @IsEnum(["pending", "edit", "sent", "archived"] as announcementStatus[])
  status?: announcementStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  ownerId?: number;


  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  landId?: number[] = [];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  roleId?: number[] = [];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  userId!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  memberId!: number;

}