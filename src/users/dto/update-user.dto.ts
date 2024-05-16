import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  photo?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
