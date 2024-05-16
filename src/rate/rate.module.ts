import { Module, forwardRef } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { RateRepository } from './rate.repository';
import { Rate, RateSchema } from './rate.model';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  controllers: [RateController],
  providers: [RateService, RateRepository],
  exports: [RateService, RateRepository],
  imports: [
    MongooseModule.forFeature([{ schema: RateSchema, name: Rate.name }]),
    forwardRef(() => UsersModule),
    forwardRef(() => MoviesModule),
  ],
})
export class RateModule {}
