
import { IsBoolean } from "class-validator";

export class UpdateCouponStatusDto {
  @IsBoolean()
  used: boolean;
}
