import { IsInt } from "class-validator";

export class CreateUserQuery {
  @IsInt()
  telegramId: number;
}