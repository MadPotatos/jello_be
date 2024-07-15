import { Priority, Type } from '@prisma/client';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export class V1Issue {
  @IsNumber()
  id: number;

  @IsNumber()
  listId: number;

  @IsNumber()
  order: number;

  @IsEnum(Priority)
  priority: Priority;

  @IsEnum(Type)
  type: Type;

  @IsString()
  summary: string;

  @IsString()
  descr: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsNumber()
  reporterId: number;
}
