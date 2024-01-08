import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':issueId')
  async getComments(@Param('issueId') issueId: number) {
    return this.commentService.getComments(issueId);
  }

  @Post()
  async createComment(@Body() body: any) {
    return this.commentService.createComment(body);
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: number) {
    return this.commentService.deleteComment(id);
  }
}
