import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";
import { requestStatus } from "../../../entities/request.entity";

export class SetRequestContentDto {
  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

}
