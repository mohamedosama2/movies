import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesRepository } from './movies.repository';
import { FilterQueryOptionsMovie } from './dto/filterQueryOptions.dto';
import { PaginateResult, Types } from 'mongoose';
import { MovieDocument } from './models/movie.model';
import { UsersService } from 'src/users/users.service';
import { UserDocument } from 'src/users/models/_user.model';

@Injectable()
export class MoviesService {
  constructor(private readonly MoviesRepository: MoviesRepository) {}
  async create(createMovieDto: CreateMovieDto) {
    return await this.MoviesRepository.create(createMovieDto);
  }
  async getMyRecommendations(me:UserDocument){
    return await this.MoviesRepository.getMyRecommendations(me)
  }
  async findAll(
    queryFiltersAndOptions: FilterQueryOptionsMovie,
  ): Promise<PaginateResult<MovieDocument> | MovieDocument[]> {
    const movies = await this.MoviesRepository.findAllWithPaginationOption(
      queryFiltersAndOptions,
      ['title', 'genre'],
    );
    return movies;
  }

  async findOne(id: string) {
    return await this.MoviesRepository.findOne({ id: new Types.ObjectId(id) });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const existingMovie = await this.MoviesRepository.updateMovie(
      id,
      updateMovieDto,
    );
    if (!existingMovie) {
      throw new NotFoundException('Movie not found');
    }
  }

  async remove(_id: string) {
    const isExisted = await this.findOne(_id);
    if (!isExisted) throw new NotFoundException('Movie not found');
    await this.MoviesRepository.deleteOne({ _id });
    return 'Deleted Successfully';
  }
  async loadCsvData() {
    return await this.MoviesRepository.loadCsvData();
  }
}
