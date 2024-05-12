import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserProfile {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  job: string;

  @IsOptional()
  @IsString()
  organization: string;
}

export class GetUserByName {
  @Type(() => UserProfile)
  users: UserProfile[];

  @IsNumber()
  total: number;
}
