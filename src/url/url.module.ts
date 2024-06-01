import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [UrlService],
  controllers: [UrlController],
  imports: [PrismaModule],
})
export class UrlModule {}
