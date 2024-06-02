import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { PrismaService } from '../prisma/prisma.service'; // Adjust the import path as needed

@Module({
  providers: [PaginationService, PrismaService],
  exports: [PaginationService],
})
export class PaginationModule {}
