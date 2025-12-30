import { IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class UpdateVoucherDto {
  
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  code?: string;

  @IsInt()
  @Min(1)
  discount?: number;

    
  @IsNotEmpty()
  @IsString()
  expiresAt?: Date;
}