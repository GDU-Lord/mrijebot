import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateLandDto {

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  region!: string;

}