import { IssuePriority, IssueType } from '@prisma/client';
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

  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @IsEnum(IssueType)
  type: IssueType;

  @IsNotEmpty()
  @IsNumber()
  reporterId: number;

  @IsNotEmpty()
  @IsEnum(IssuePriority)
  priority: IssuePriority;
}
