import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';

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

  @IsEnum(Role)
  role: Role;
}

export class GetMemberList {
  @Type(() => GetMember)
  members: GetMember[];

  @IsNumber()
  total: number;
}
