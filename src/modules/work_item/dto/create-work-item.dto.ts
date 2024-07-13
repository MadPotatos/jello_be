import { Priority, Type } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PostIssueDto {
  @IsNotEmpty()
  @IsString()
  summary: string;

  @IsOptional()
  @IsNumber()
  parentId: number;

  @IsOptional()
  @IsNumber()
  sprintId: number;

  @IsOptional()
  @IsNumber()
  listId: number;

  @IsOptional()
  @IsNumber()
  userStoryId: number;

  @IsNotEmpty()
  @IsEnum(Type)
  type: Type;

  @IsNotEmpty()
  @IsEnum(Priority)
  priority: Priority;
}
