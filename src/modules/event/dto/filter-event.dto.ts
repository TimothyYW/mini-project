import { IsOptional, IsString } from "class-validator";

export class QueryEventDto {
  @IsOptional()
  @IsString()
  search?: string;
}
