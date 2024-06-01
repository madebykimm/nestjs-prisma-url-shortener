import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { UrlModule } from './url/url.module';
import { UrlService } from './url/url.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule, UrlModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, UrlService],
})
export class AppModule {}
