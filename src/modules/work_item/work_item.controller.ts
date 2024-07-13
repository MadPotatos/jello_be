import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { WorkItemService } from './work_item.service';
import { PostIssueDto } from './dto/create-work-item.dto';

@Controller('issues')
export class WorkItemController {
  constructor(private readonly workItemService: WorkItemService) {}

  @Get('all/:projectId')
  async getAllworkItemsInProject(@Param('projectId') projectId: number) {
    return this.workItemService.getAllworkItemsByProject(projectId);
  }

  @Get('list/:projectId')
  async getworkItemsInProject(@Param('projectId') projectId: number) {
    return this.workItemService.getworkItemsByListInProject(projectId);
  }

  @Get('sprint/:projectId')
  async getworkItemsInSprint(@Param('projectId') projectId: number) {
    return this.workItemService.getworkItemsBySprintInProject(projectId);
  }

  @Get('sub/:id')
  async getSubworkItems(@Param('id') id: number) {
    return this.workItemService.getSubworkItemsByworkItem(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createIssue(@Body() body: PostIssueDto) {
    return this.workItemService.createworkItem(body);
  }

  @Put(':id')
  async updateIssue(@Param('id') id: number, @Body() body: any) {
    return this.workItemService.updateworkItem(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteIssue(@Param('id') id: number) {
    return this.workItemService.deleteworkItem(id);
  }

  @Post('reorder')
  async reorderworkItems(@Body() body: any) {
    return this.workItemService.reorderworkItems(body);
  }

  @Put('update/:id')
  async updateworkItems(@Param('id') id: number) {
    return this.workItemService.updatedAt(id);
  }

  @Post('task')
  async createTask(@Body() body: any) {
    return this.workItemService.createTask(body);
  }

  @Get('/user-story/not-in-sprint/:id')
  async getworkItemsNotInSprint(@Param('id') id: number) {
    return this.workItemService.getTaskByUserStorythatNotHaveSprint(id);
  }

  @Put('sprint/:id/:sprintId')
  async addIssueToSprint(
    @Param('id') id: number,
    @Param('sprintId') sprintId: number,
  ) {
    return this.workItemService.addTaskInUserStorytoSprint(id, sprintId);
  }

  @Get('/assigned/:projectId/:userId')
  async getAssignedworkItems(
    @Param('projectId') projectId: number,
    @Param('userId') userId: number,
  ) {
    return await this.workItemService.findAssignedworkItemsInProject(
      projectId,
      userId,
    );
  }

  @Get('/all-workItems-and-user-story/:projectId')
  async getAllworkItemsAndUserStory(@Param('projectId') projectId: number) {
    return await this.workItemService.getAllworkItemsAndUserStories(projectId);
  }
}
