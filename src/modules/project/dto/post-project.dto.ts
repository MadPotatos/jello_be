import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PostProjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  repo: string;

  @IsString()
  image: string;

  @IsNumber()
  userId: number;
}
