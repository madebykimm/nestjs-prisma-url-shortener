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
import { CachingService } from 'src/cache/caching.service';

@Controller('admin/urls')
@ApiTags('Admin URL')
export class UrlController {
  constructor(
    private service: UrlService,
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
    @Query('page', ParseIntPipe) page: number = 1, // Default page is 1
    @Query('limit', ParseIntPipe) limit: number = 10, // Default limit is 10
    @Req() req: any,
  ) {
    const currentUserId = req.user.id;
    let urls = await this.cachingService.getFromCache(
      `url-${currentUserId}-${page}-${limit}`,
    );
    if (!urls) {
      urls = await this.service.findAll(page, limit);
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
