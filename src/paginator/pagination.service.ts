import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust the import path as needed
import { PaginationQueryDto, PaginationResultDto } from './dto/paginator.dto';

@Injectable()
export class PaginationService {
  constructor(private prisma: PrismaService) {}

  async paginate<T>(
    query: PaginationQueryDto,
    model: any, // Ensure type safety with PrismaService keys
    select?: any,
  ): Promise<PaginationResultDto<T>> {
    const { page, limit } = query;

    // Ensure model name is correct and exists in PrismaService
    const dataModel = this.prisma[model] as any;

    if (!dataModel) {
      throw new Error(`Model ${model} does not exist on PrismaService`);
    }

    const [data, totalCount] = await Promise.all([
      dataModel.findMany({
        skip: page * limit,
        take: parseInt(limit.toString()),
        ...select,
      }),
      dataModel.count(),
    ]);

    return {
      data,
      page,
      limit,
      totalCount,
    };
  }
}
