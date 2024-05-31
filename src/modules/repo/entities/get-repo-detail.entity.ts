import { IsNumber, IsString } from 'class-validator';

export class V1RepoDetail {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  description: string;

  @IsString()
  owner: string;

  @IsString()
  language: string;

  @IsNumber()
  stars: number;

  @IsNumber()
  forks: number;
}
