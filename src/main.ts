import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/filters/http-exception.filter';
import * as helmet from 'helmet';
import * as logger from 'morgan';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { PaginatedDto } from './utils/pagination/paginated.dto';
import { User } from './users/models/_user.model';

import { FilterQueryOptionsUser } from './users/dto/filterQueryOptions.dto';
import ParamsWithId from './utils/paramsWithId.dto';
import { RedisIoAdapter } from './chat/redisIoAdapter';
import * as mongoose from 'mongoose'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /*   app.useWebSocketAdapter(new RedisIoAdapter(app)); */
  app.use(logger('dev'));
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  // swagger config
  const options = new DocumentBuilder()
    .setTitle('NEST STRUCTURE')
    .setDescription('The Nest.js structure API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  const document = SwaggerModule.createDocument(app, options, {
    extraModels: [PaginatedDto, User, FilterQueryOptionsUser, ParamsWithId],
  });
  SwaggerModule.setup('api', app, document, customOptions);
  const server = await app.listen(process.env.PORT);

  // If the Node process ends, close the Mongoose connection
  const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT']
  sigs.forEach(sig => {
    process.on(sig, () => {
      console.log(sig)
      // Stops the server from accepting new connections and finishes existing connections.
      server.close(function (err) {
        if (err) {
          console.error(err)
          process.exit(1)
        }
        console.log('Http server closed.');
        // close your database connection and exit with success 
        // for example with mongoose
        mongoose.connection.close(false, function () {
          console.log('Mongoose connection disconnected')
          process.exit(0)
        })
      })
    })
  })


}
bootstrap();
