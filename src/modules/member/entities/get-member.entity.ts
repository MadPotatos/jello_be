import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class GetMember {
  @IsNumber()
  userId: number;

  @IsNumber()
  projectId: number;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  avatar: string;

  @IsBoolean()
  isAdmin: boolean;
}

export class GetMemberList {
  @Type(() => GetMember)
  members: GetMember[];

  @IsNumber()
  total: number;
}
