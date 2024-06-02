// src/users/users.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    console.log(isExist);

    if (isExist) {
      throw new BadRequestException('Email already Exist!');
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;

    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const isExist = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!isExist) {
      throw new BadRequestException('User Not Found!');
    }
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const isExist = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!isExist) {
      throw new BadRequestException('User Not Found!');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async softDelete(id: number) {
    const isExist = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!isExist) {
      throw new BadRequestException('User Not Found!');
    }

    try {
      const url = await this.prisma.user.update({
        where: { id },
        data: { isDeleted: true },
      });
      if (url) return url;
    } catch (error) {
      throw new NotFoundException('User Not Found');
    }
  }
}
