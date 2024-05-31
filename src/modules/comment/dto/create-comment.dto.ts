import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostCommentDto {
  @IsString()
  @IsNotEmpty()
  descr: string;

  @IsNumber()
  @IsNotEmpty()
  issueId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
