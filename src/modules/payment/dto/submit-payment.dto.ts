import { IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class SubmitPaymentProofDto {
    
  @IsNotEmpty()
  @IsString()
  proof!: string;
}