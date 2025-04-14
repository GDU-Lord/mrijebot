import { IsEnum, IsOptional, IsInt, IsPositive, IsDateString } from "class-validator";
import { announcementStatus, announcementType } from "../../../entities/announcement.entity";
import { Transform, Type } from "class-transformer";

export class GetAnnouncementsQuery {
  
  @IsOptional()
  @IsEnum(["local", "global", "game", "private"] as announcementType[])
  tag?: announcementType;
  
  @IsOptional()
  @IsEnum(["pending", "edit", "sent", "archived"] as announcementStatus[])
  status?: announcementStatus;

  // @Transform(({ value }) => (value === undefined || value === '' ? undefined : value))
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id?: number;

  // @Transform(({ value }) => (value === undefined || value === '' ? undefined : value))
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  ownerId?: number;


  // @Transform(({ value }) => (value === undefined || value === '' ? undefined : value))
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  landId?: number;

  // @Transform(({ value }) => (value === undefined || value === '' ? undefined : value))
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  roleId?: number;

  // @Transform(({ value }) => (value === undefined || value === '' ? undefined : value))
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  userId!: number;

  // @Transform(({ value }) => (value === undefined || value === '' ? undefined : value))
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  memberId!: number;

}