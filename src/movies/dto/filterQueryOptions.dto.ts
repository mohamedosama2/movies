import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { escapeRegExp } from 'lodash';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';
import { IntersectionType } from '@nestjs/swagger';

export class FilterQueryMovie {
  @IsOptional()
  @Transform(({ obj }) => {
    return new RegExp(escapeRegExp(obj.title), 'i');
  })
  title?: string;

  @IsOptional()
  @IsString()
  genre?: string;
}

export class FilterQueryOptionsMovie extends IntersectionType(
  FilterQueryMovie,
  PaginationParams,
) {}
