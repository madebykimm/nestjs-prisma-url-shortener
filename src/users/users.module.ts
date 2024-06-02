// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PaginationModule } from 'src/paginator/pagination.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, PaginationModule],
  exports: [UsersService],
})
export class UsersModule {}
