
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateCouponDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsInt()
  @Min(1)
  discount: number;

  @IsNotEmpty()
  expiresAt: Date;
}
