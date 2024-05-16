import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { cacheOperationsService } from './cache-operations.service';
import { CacheConfigService } from './cacheConfigService';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useClass: CacheConfigService,
    }),
  ],
  providers: [cacheOperationsService],
  exports: [cacheOperationsService],
})
export class cacheOperationsModule {}
