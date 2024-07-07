import { IssuePriority, IssueType } from '@prisma/client';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export class V1Issue {
  @IsNumber()
  id: number;

  @IsNumber()
  listId: number;

  @IsNumber()
  order: number;

  @IsEnum(IssuePriority)
  priority: IssuePriority;

  @IsEnum(IssueType)
  type: IssueType;

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
