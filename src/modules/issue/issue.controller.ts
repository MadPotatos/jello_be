import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { IssueService } from './issue.service';

@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Get(':projectId')
  async getIssuesInProject(
    @Param('projectId') projectId: number,
    @Query('userId') userId?: number,
  ) {
    return this.issueService.getIssuesInProject(projectId, userId);
  }

  @Post()
  async createIssue(@Body() body: any) {
    return this.issueService.createIssue(body);
  }

  @Put(':id')
  async updateIssue(@Param('id') id: number, @Body() body: any) {
    return this.issueService.updateIssue(id, body);
  }

  @Delete(':id')
  async deleteIssue(@Param('id') id: number) {
    return this.issueService.deleteIssue(id);
  }

  @Post('reorder')
  async reorderIssues(@Body() body: any) {
    return this.issueService.reorderIssues(body);
  }

  @Put('update/:id')
  async updateIssues(@Param('id') id: number) {
    return this.issueService.updatedAt(id);
  }
}
