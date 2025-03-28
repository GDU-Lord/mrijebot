import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateGameSystemDto {

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name!: string;

}