import { Controller, Get, Param } from '@nestjs/common';
import { ProjectService } from './project.service';
import { V1ProjectsList } from './entities/get-projects-list.entity';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('/all/:userId')
  async getProjectsByUserId(
    @Param('userId') userId: number,
  ): Promise<V1ProjectsList> {
    return await this.projectService.findByUserId(userId);
  }

  @Get(':id')
  async getProjectById(@Param('id') id: number) {
    return await this.projectService.findById(id);
  }
}
