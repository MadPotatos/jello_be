import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class V1ProjectDetail {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  repo: string;

  @IsString()
  image: string;

  @IsBoolean()
  isDeleted: boolean;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
