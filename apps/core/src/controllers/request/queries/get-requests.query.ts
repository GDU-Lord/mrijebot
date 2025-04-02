import { IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsPort, IsPositive, IsString, Matches } from "class-validator";
import { User } from "node-telegram-bot-api";
import { Member, Land } from "../../../entities";
import { Role } from "../../../entities/role.entity";
import { requestStatus } from "../../../entities/request.entity";
import { Type } from "class-transformer";

export class GetRequestsQuery {
  
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tag?: string;

  @IsOptional()
  @IsEnum(["open", "in_progress", "fulfilled", "rejected"] as requestStatus[])
  status?: requestStatus;

  @IsOptional()
  @IsString()
  content?: string;


  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  fromUserId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  fromRoleId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  fromMemberId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  fromLandId?: number;


  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  toRoleId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  toUserId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  toMemberId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  toLandId?: number;

}
