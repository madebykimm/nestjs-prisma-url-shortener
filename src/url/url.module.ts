import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CachingModule } from 'src/cache/caching.module';

@Module({
  providers: [UrlService],
  controllers: [UrlController],
  imports: [PrismaModule, CachingModule],
})
export class UrlModule {}
