import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CachingModule } from '../cache/caching.module';
import { PaginationModule } from '../paginator/pagination.module';

@Module({
  providers: [UrlService],
  controllers: [UrlController],
  imports: [PrismaModule, CachingModule, PaginationModule],
})
export class UrlModule {}
