import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsObject, IsOptional, IsPositive, IsString, Matches } from "class-validator";
import { announcementStatus, announcementType } from "../../../entities/announcement.entity";

export class UpdateAnnouncementDto {

  @IsOptional()
  @IsEnum(["pending", "edit", "sent", "archived"] as announcementStatus[])
  status?: announcementStatus;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string;

  @IsOptional()
  @Matches(/^\d+$/, { each: true })
  instanceIds: string[] = [];

  @IsOptional()
  @Matches(/^\d+$/, { each: true })
  recepientIds: string[] = [];

}