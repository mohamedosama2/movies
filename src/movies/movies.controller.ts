import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterQueryOptionsMovie } from './dto/filterQueryOptions.dto';
import { PaginateResult } from 'mongoose';
import { MovieDocument } from './models/movie.model';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserDocument, UserRole } from 'src/users/models/_user.model';
import { CreateRateDto } from 'src/rate/dto/create-rate.dto';
import ParamsWithId from 'src/utils/paramsWithId.dto';
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { RateDocument } from 'src/rate/rate.model';
import { RateService } from 'src/rate/rate.service';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';

@ApiTags('movies')
@ApiBearerAuth()
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly rateService: RateService,
  ) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  async findAll(
    @Query() queryFiltersAndOptions: FilterQueryOptionsMovie,
  ): Promise<PaginateResult<MovieDocument> | MovieDocument[]> {
    return await this.moviesService.findAll(
      queryFiltersAndOptions as FilterQueryOptionsMovie,
    );
  }
  @Get("/recommendation")
  async getMyRecommendations(@AuthUser() me:UserDocument){
    return await this.moviesService.getMyRecommendations(me)
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async updateMovie(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    const updatedMovie = await this.moviesService.update(id, updateMovieDto);
    return updatedMovie;
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }

  @Public()
  @Post('load-data')
  async loadCsvData(): Promise<void> {
    await this.moviesService.loadCsvData();
  }

  @Post('/rate/:id')
  async addRate(
    @Body() createRateDto: CreateRateDto,
    @Param() { id }: ParamsWithId,
    @AuthUser() me: UserDocument,
  ): Promise<RateDocument> {
    return await this.rateService.create(createRateDto, 'movies', id, me._id);
  }

  @Get('/rates/:id')
  async getAllRates(
    @Param() { id }: ParamsWithId,
    @Query() PaginationParams: PaginationParams,
  ): Promise<PaginateResult<RateDocument> | RateDocument[]> {
    return await this.rateService.fetchAllRates(PaginationParams, 'movies', id);
  }
 
}
