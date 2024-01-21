import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostIssueDto {
  @IsNotEmpty()
  @IsString()
  summary: string;

  @IsNotEmpty()
  @IsNumber()
  listId: number;

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
