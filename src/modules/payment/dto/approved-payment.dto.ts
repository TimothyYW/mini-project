import { IsBoolean, IsInt, IsNotEmpty, Min } from 'class-validator';

export class ApprovedPaymentDto {
    
  @IsNotEmpty()
  @IsBoolean()
  isApproved?: boolean;

}