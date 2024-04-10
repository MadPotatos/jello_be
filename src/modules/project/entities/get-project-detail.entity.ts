import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

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

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
