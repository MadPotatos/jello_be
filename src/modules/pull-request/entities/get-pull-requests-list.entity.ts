import { IsDate, IsNumber, IsString } from 'class-validator';

export class V1PullRequest {
  @IsString()
  title: string;

  @IsString()
  url: string;

  @IsString()
  user: string;

  @IsString()
  state: string;

  @IsString()
  createdAt: string;

  @IsString()
  head: string;

  @IsString()
  base: string;
}

export class V1PullRequestList {
  @IsString()
  pullRequests: V1PullRequest[];

  @IsNumber()
  total: number;
}
