import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IssueService } from './issue.service';
import { PostIssueDto } from './dto/create-issue.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Get('all/:projectId')
  async getAllIssuesInProject(@Param('projectId') projectId: number) {
    return this.issueService.getAllIssuesByProject(projectId);
  }

  @Get('list/:projectId')
  async getIssuesInProject(@Param('projectId') projectId: number) {
    return this.issueService.getIssuesByListInProject(projectId);
  }

  @Get('sprint/:projectId')
  async getIssuesInSprint(@Param('projectId') projectId: number) {
    return this.issueService.getIssuesBySprintInProject(projectId);
  }

  @Get('sub/:id')
  async getSubIssues(@Param('id') id: number) {
    return this.issueService.getSubIssuesByIssue(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createIssue(@Body() body: PostIssueDto) {
    return this.issueService.createIssue(body);
  }

  @Put(':id')
  async updateIssue(@Param('id') id: number, @Body() body: any) {
    return this.issueService.updateIssue(id, body);
  }

  @UseGuards(JwtGuard)
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

  @Post('task')
  async createTask(@Body() body: any) {
    return this.issueService.createTask(body);
  }
}
