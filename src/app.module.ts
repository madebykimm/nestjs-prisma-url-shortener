import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { UrlModule } from './url/url.module';
import { UrlService } from './url/url.service';
import { AuthModule } from './auth/auth.module';
import { CachingModule } from './cache/caching.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [AuthModule, UsersModule, UrlModule, PrismaModule, CachingModule],
  controllers: [AppController, AuthController],
  providers: [AppService, UrlService],
})
export class AppModule {}
