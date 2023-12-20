import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { GetLeaderInfo } from 'src/modules/member/entities/get-leader-info.entity';

export class V1Project {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @Type(() => GetLeaderInfo)
  leader: GetLeaderInfo;
}

export class V1ProjectsList {
  @Type(() => V1Project)
  projects: V1Project[];

  @IsNumber()
  total: number;
}
