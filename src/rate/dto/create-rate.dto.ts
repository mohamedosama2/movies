import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRateDto {
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}
