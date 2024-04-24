import { SprintStatus } from '@prisma/client';

import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class V1Sprint {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  goal?: string;

  @IsNumber()
  order: number;

  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsDate()
  createdAt: Date;

  @IsEnum(SprintStatus)
  status: SprintStatus;
}
