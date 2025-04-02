import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";
import { requestStatus } from "../../../entities/request.entity";

export class CreateRequestDto {
  
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  tag!: string;

  @IsOptional()
  @IsEnum(["open", "in_progress", "fulfilled", "rejected"] as requestStatus[])
  status?: requestStatus = "open";

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;


  @IsOptional()
  @IsInt()
  @IsPositive()
  fromUser?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  fromRole?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  fromMember?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  fromLand?: number;

  
  @IsOptional()
  @IsInt()
  @IsPositive()
  toRole?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  toUser?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  toMember?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  toLand?: number;


  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  signatures?: number[] = [];

}
