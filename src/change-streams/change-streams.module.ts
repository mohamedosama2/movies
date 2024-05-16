import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database.module';
import { UsersModule } from 'src/users/users.module';
import { ChangeStreamsService } from './change-streams.service';

@Module({
  providers: [ChangeStreamsService],
  imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule],
})
export class ChangeStreamsModule {}
