import {
  CacheModule,
  Module,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserRole, UserSchema } from './models/_user.model';
import { FanSchema } from './models/fan.model';
import { AdminSchema } from './models/admin.model';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UploadCloudinary } from 'src/utils/services/upload-cloudinary';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from './users.repository';
import { RateModule } from 'src/rate/rate.module';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  imports: [
    forwardRef(() => RateModule),
    MoviesModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [
          { name: UserRole.FAN, schema: FanSchema },
          { name: UserRole.ADMIN, schema: AdminSchema },
        ],
      },
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: UploadCloudinary,
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
