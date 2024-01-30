import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UserProfile {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  avatar: string;

  @IsString()
  job: string;

  @IsString()
  organization: string;
}

export class GetUserByName {
  @Type(() => UserProfile)
  users: UserProfile[];

  @IsNumber()
  total: number;
}
