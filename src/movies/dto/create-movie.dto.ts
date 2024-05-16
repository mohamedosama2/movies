// create-movie.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  director: string;

  @IsNotEmpty()
  @IsString()
  year: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNumber()
  length: number;

  @IsNotEmpty()
  @IsString()
  genre: string;

  @IsNotEmpty()
  @IsString()
  colour: string;

  @IsNotEmpty()
  @IsArray()
  rankingByYear: { rank: number; year: number; month: number; day: number }[];
}
