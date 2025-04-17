import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Matches } from "class-validator";

export class AddChatDto {

  @IsString()
  @Matches(/^-?\d+$/)
  chatId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsString()
  invite!: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  landId!: number | null;
  
}