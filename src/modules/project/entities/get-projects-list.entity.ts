import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { GetMember } from 'src/modules/member/entities/get-member.entity';

export class V1Project {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @Type(() => GetMember)
  leader: GetMember;
}

export class V1ProjectsList {
  @Type(() => V1Project)
  projects: V1Project[];

  @IsNumber()
  total: number;
}
