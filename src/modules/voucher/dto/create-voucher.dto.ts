import { IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class CreateVoucherDto {
    
  
  
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  code!: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  discount!: number;

    
  @IsNotEmpty()
  @IsString()
  expiresAt!: Date;
}