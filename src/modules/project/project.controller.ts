import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { V1ProjectsList } from './entities/get-projects-list.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PostProjectDto } from './dto/post-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('/all/:userId')
  async getProjectsByUserId(
    @Param('userId') userId: number,
  ): Promise<V1ProjectsList> {
    return await this.projectService.getProjectsByUserId(userId);
  }

  @Get(':id')
  async getProjectById(@Param('id') id: number) {
    return await this.projectService.getById(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  async createProject(@Body() body: PostProjectDto) {
    return await this.projectService.createProject(body);
  }
}
