import { IsNumber, IsString } from 'class-validator';

export class PostProjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  repo: string;

  @IsString()
  image: string;

  @IsNumber()
  userId: number;
}
