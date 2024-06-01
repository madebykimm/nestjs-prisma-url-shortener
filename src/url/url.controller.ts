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

@Controller('admin/urls')
@ApiTags('Admin URL')
export class UrlController {
  constructor(private service: UrlService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  create(
    @Body()
    url: ShortenURLDto,
    @Req() req: any,
  ) {
    const currentUserId = req.user.id;
    return this.service.create(url, currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1, // Default page is 1
    @Query('limit', ParseIntPipe) limit: number = 10, // Default limit is 10
  ) {
    return this.service.findAll(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Put(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    url: ShortenURLDto,
    @Req() req: any,
  ) {
    const currentUserId = req.user.id;

    return this.service.update(id, url, currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const currentUserId = req.user.id;
    return this.service.softDelete(id, currentUserId);
  }
}
