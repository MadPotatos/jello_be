import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserStoryService } from './user_story.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('user-story')
export class UserStoryController {
  constructor(private readonly userStoryService: UserStoryService) {}

  //@UseGuards(JwtGuard)
  @Get(':projectId')
  async getUserStoriesByProjectId(@Param('projectId') projectId: number) {
    return await this.userStoryService.getUserStoriesByProjectId(projectId);
  }

  //@UseGuards(JwtGuard)
  @Post()
  async createUserStory(@Body() body: any) {
    return await this.userStoryService.createUserStory(body);
  }

  @Put(':id')
  async updateUserStory(@Param('id') id: number, @Body() body: any) {
    return await this.userStoryService.updateUserStory(id, body);
  }

  @Delete(':id')
  async deleteUserStory(@Param('id') id: number) {
    return await this.userStoryService.deleteUserStory(id);
  }

  @Get('not-done/:projectId')
  async getNotDoneUserStoriesByProjectId(
    @Param('projectId') projectId: number,
  ) {
    return await this.userStoryService.getNotDoneUserStoriesByProjectId(
      projectId,
    );
  }

  @Put(':id/sprint/:sprintId')
  async addUserStoryToSprint(
    @Param('id') userStoryId: number,
    @Param('sprintId') sprintId: number,
  ) {
    return await this.userStoryService.addUserStoryToSprint(
      sprintId,
      userStoryId,
    );
  }
}
