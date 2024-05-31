import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PostCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':issueId')
  async getComments(@Param('issueId') issueId: number) {
    return this.commentService.getComments(issueId);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createComment(@Body() body: PostCommentDto) {
    return this.commentService.createComment(body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteComment(@Param('id') id: number) {
    return this.commentService.deleteComment(id);
  }
}
