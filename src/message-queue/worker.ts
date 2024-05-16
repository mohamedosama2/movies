import { NestFactory } from '@nestjs/core';
import { MessageQueueModule } from './test1-consumer.module';

async function bootstrap() {
  const app = await NestFactory.create(MessageQueueModule);
  app.init(); 
}

bootstrap();
