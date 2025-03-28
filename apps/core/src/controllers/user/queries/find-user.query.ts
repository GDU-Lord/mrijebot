import { IsInt, IsOptional } from "class-validator";

export class FindUserQuery {
  @IsOptional()
  @IsInt()
  telegramId?: number;

  @IsInt()
  pageIndex: number = 0;

  @IsInt()
  pageSize: number = 10;
}
