import { IsEnum, IsInt, IsPositive } from "class-validator";
import { MemberStatus } from "../../../entities";

export class JoinLandDto {
  @IsInt()
  @IsPositive()
  landId!: number;
  
  @IsEnum(['guest', 'participant'])
  status!: MemberStatus;
}
