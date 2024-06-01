import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async addToCache(key: string, value: any): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async getFromCache(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async removeFromCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async clearCache(): Promise<void> {
    await this.cacheManager.reset();
  }
}
