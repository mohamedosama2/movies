import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database.module';
import { UsersModule } from 'src/users/users.module';
import { ConsumerService } from './test1-consumer.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    forwardRef(() => UsersModule),
  ],
  providers: [ConsumerService],
})
export class MessageQueueModule {}
