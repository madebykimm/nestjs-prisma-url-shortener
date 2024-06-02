import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortenURLDto } from './dtos/url.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { CachingService } from '../cache/caching.service';
import { Url, User } from '@prisma/client';
import { url } from 'inspector';
import {
  PaginationQueryDto,
  PaginationResultDto,
} from 'src/paginator/dto/paginator.dto';
import { PaginationService } from 'src/paginator/pagination.service';

@Controller('admin/urls')
@ApiTags('Admin URL')
export class UrlController {
  constructor(
    private service: UrlService,
    private readonly paginationService: PaginationService,
    private readonly cachingService: CachingService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async create(
    @Body()
    url: ShortenURLDto,
    @Req() req: any,
  ) {
    const currentUserId = req.user.id;
    return await this.service.create(url, currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get()
  async findAll(
    @Req() req: any,
    @Query() { page, limit }: PaginationQueryDto,
  ): Promise<PaginationResultDto<Url>> {
    const currentUserId = req.user.id;
    let urls = await this.cachingService.getFromCache(
      `url-${currentUserId}-${page}-${limit}`,
    );
    if (!urls) {
      urls = this.paginationService.paginate<Url>({ page, limit }, 'url');
      await this.cachingService.addToCache(
        `url-${currentUserId}-${page}-${limit}`,
        urls,
      );
    }
    return urls;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    let url = await this.cachingService.getFromCache(`url-${id}`);
    if (!url) {
      url = await this.service.findOne(id);
      await this.cachingService.addToCache(`url-id-${id}`, url);
    }
    return url;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Put(':id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    url: ShortenURLDto,
    @Req() req: any,
  ) {
    const currentUserId = req.user.id;
    await this.cachingService.removeFromCache(`url-id-${id}`);

    return this.service.update(id, url, currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const currentUserId = req.user.id;
    await this.cachingService.removeFromCache(`url-id-${id}`);
    return await this.service.softDelete(id, currentUserId);
  }
}
