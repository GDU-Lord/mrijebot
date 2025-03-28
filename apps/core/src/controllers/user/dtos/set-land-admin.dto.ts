import { IsBoolean } from "class-validator";

export class SetLandAdminDto {
  @IsBoolean()
  isLandAdmin!: boolean;
}
