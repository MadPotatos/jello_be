import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class GetLeaderInfo {
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
