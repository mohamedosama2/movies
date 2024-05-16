import { NestFactory } from '@nestjs/core';
import { ChangeStreamsModule } from './change-streams.module';

async function bootstrap() {
  const app = await NestFactory.create(ChangeStreamsModule);
  app.init();
}

bootstrap();
