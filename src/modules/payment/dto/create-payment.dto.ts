import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
    
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity!: number;

  @IsString()
  @IsOptional()
  vouchercode?: string;

  @IsString()
  @IsOptional()
  couponcode?: string;
}