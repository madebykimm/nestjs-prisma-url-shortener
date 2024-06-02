import { IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationQueryDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(0)
  page: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  limit: number;
}

export class PaginationResultDto<T> {
  data: T[];
  page: number;
  limit: number;
  totalCount: number;
}
