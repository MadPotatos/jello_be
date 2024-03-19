import { IsDate, IsNumber, IsString } from 'class-validator';

export class V1Issue {
  @IsNumber()
  id: number;

  @IsNumber()
  listId: number;

  @IsNumber()
  order: number;

  @IsNumber()
  priority: number;

  @IsNumber()
  type: number;

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
