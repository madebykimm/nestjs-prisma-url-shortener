/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShortenURLDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUrl(undefined, { message: ' Url is not valid.' })
  longUrl: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  urlCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
}
