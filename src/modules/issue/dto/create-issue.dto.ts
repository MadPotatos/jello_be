import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostIssueDto {
  @IsNotEmpty()
  @IsString()
  summary: string;

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
  @IsNumber()
  type: number;

  @IsNotEmpty()
  @IsNumber()
  reporterId: number;

  @IsNotEmpty()
  @IsNumber()
  priority: number;
}
