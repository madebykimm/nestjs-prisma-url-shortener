import { Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 2592000, // 1 month in seconds
    }),
  ],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}
