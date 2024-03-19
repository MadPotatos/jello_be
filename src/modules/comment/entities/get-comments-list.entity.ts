import { IsDate, IsNumber, IsString } from 'class-validator';

export class V1Comment {
  @IsNumber()
  id: number;

  @IsString()
  descr: string;

  @IsDate()
  createdAt: Date;

  @IsString()
  name: string;

  @IsString()
  avatar: string;
}
