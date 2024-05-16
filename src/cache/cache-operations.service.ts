import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Injectable()
export class cacheOperationsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async clearCache(key: string) {
    await this.cacheManager.del(key);
  }
}
