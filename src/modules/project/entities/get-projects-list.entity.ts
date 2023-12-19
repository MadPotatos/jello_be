import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class V1Project {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsNumber()
  leaderId: number;

  @IsString()
  leaderName: string;

  @IsString()
  leaderAvatar: string;
}

export class V1ProjectsList {
  @Type(() => V1Project)
  projects: V1Project[];

  @IsNumber()
  total: number;
}
