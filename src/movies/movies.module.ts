import { Module, forwardRef } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './models/movie.model';
import { MoviesRepository } from './movies.repository';
import { RateModule } from 'src/rate/rate.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: MovieSchema, name: Movie.name }]),
   forwardRef(()=>RateModule) 
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesRepository],
  exports: [MoviesService, MoviesRepository],
})
export class MoviesModule {}
