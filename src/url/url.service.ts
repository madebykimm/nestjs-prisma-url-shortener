import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ShortenURLDto } from './dtos/url.dto';
import { nanoid } from 'nanoid';
import { isURL } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}
  async create(url: ShortenURLDto, currentUserId: number) {
    const { longUrl, title } = url;
    let { urlCode } = url;

    //checks if longurl is a valid URL
    if (!isURL(longUrl)) {
      throw new BadRequestException('String Must be a Valid URL');
    }

    if (!urlCode) urlCode = nanoid(10);
    const baseURL = 'http://localhost:3000';

    try {
      //check if the URL has already been shortened
      const url = await this.prisma.url.findFirst({
        where: { longUrl },
      });
      //return it if it exists
      if (url) return url.sortUrl;
      const sortUrl = `${baseURL}/${urlCode}`;

      //if it doesnt exist shorten it
      await this.prisma.url.create({
        data: {
          longUrl,
          sortUrl,
          urlCode,
          title,
          authorId: currentUserId,
        },
      });

      return sortUrl;
    } catch (error) {
      throw new UnprocessableEntityException('Server Error');
    }
  }

  async findAll(page: number, limit: number, currentUserId: number) {
    const skip = (page - 1) * limit;
    const data = await this.prisma.url.findMany({
      where: {
        authorId: currentUserId,
      },
      skip,
      take: limit,
    });
    const totalCount = await this.prisma.url.count(); // Total count of records

    return {
      data,
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async findOne(id: number) {
    try {
      const url = await this.prisma.url.findFirst({
        where: {
          id,
        },
      });
      if (url) return url;
    } catch (error) {
      throw new NotFoundException('Resource Not Found');
    }
  }

  async update(id: number, url: ShortenURLDto, currentUserId: number) {
    const { longUrl } = url;
    let { urlCode } = url;

    const currentUrl = await this.findOne(id);

    //checks if longurl is a valid URL

    if (currentUrl.longUrl !== longUrl) {
      if (currentUrl.longUrl !== longUrl) {
        if (!isURL(longUrl)) {
          throw new BadRequestException('String Must be a Valid URL');
        }
      }
    }

    try {
      //check if the URL has already been shortened
      if (!urlCode) urlCode = nanoid(10);

      const baseURL = 'http://localhost:3000';
      const url = await this.prisma.url.findFirst({
        where: { longUrl, authorId: currentUserId },
      });
      //return it if it exists
      if (url) return url.sortUrl;
      const sortUrl = `${baseURL}/${urlCode}`;

      //if it doesn't exist shorten it
      const updatedUrl = await this.prisma.url.update({
        where: {
          id,
        },
        data: {
          ...url,
          sortUrl,
          authorId: currentUserId,
        },
      });

      return updatedUrl.sortUrl;
    } catch (error) {
      throw new UnprocessableEntityException('Server Error');
    }
  }

  async softDelete(id: number, currentUserId: number) {
    try {
      const url = await this.prisma.url.update({
        where: { id, authorId: currentUserId },
        data: { isDeleted: true },
      });
      if (url) return url;
    } catch (error) {
      throw new NotFoundException('Resource Not Found');
    }
  }

  async redirect(urlCode: string) {
    try {
      const url = await this.prisma.url.findFirst({
        where: {
          urlCode,
        },
      });
      await this.prisma.url.update({
        where: {
          urlCode,
        },
        data: {
          totalHit: url.totalHit + 1,
        },
      });
      if (url) return url;
    } catch (error) {
      throw new NotFoundException('Resource Not Found');
    }
  }
  async recordHit(urlCode: string) {
    try {
      const url = await this.prisma.url.findFirst({
        where: {
          urlCode,
        },
      });
      await this.prisma.url.update({
        where: {
          urlCode,
        },
        data: {
          totalHit: url.totalHit + 1,
        },
      });
    } catch (error) {
      throw new NotFoundException('Resource Not Found');
    }
  }
}
