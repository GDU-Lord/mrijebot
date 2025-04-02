import { IsInt, IsOptional, IsString, Matches } from "class-validator";

export class FindUserQuery {
  @IsOptional()
  @IsString()
  @Matches(/^-?\d+$/)
  telegramId?: string;

  @IsInt()
  pageIndex: number = 0;

  @IsInt()
  pageSize: number = 10;
}
