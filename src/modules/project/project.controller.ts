import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { V1ProjectsList } from './entities/get-projects-list.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PostProjectDto } from './dto/post-project.dto';
import { V1ProjectDetail } from './entities/get-project-detail.entity';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('/all/:userId')
  async getProjectsByUserId(
    @Param('userId') userId: number,
  ): Promise<V1ProjectsList> {
    return await this.projectService.getProjectsByUserId(userId);
  }

  @Get('/deleted/:userId')
  async getDeletedProjectsByUserId(
    @Param('userId') userId: number,
  ): Promise<V1ProjectsList> {
    return await this.projectService.getDeletedProjectsByUserId(userId);
  }

  @Get(':id')
  async getProjectById(@Param('id') id: number): Promise<V1ProjectDetail> {
    return await this.projectService.getById(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  async createProject(@Body() body: PostProjectDto) {
    return await this.projectService.createProject(body);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateProject(@Param('id') id: number, @Body() body: any) {
    return await this.projectService.updateProject(id, body);
  }

  @Put(':id/image')
  @UseGuards(JwtGuard)
  async updateProjectImage(@Param('id') id: number, @Body() body: any) {
    return await this.projectService.updateImage(id, body);
  }

  @Put('delete/:id')
  @UseGuards(JwtGuard)
  async deleteProject(@Param('id') id: number) {
    return await this.projectService.deleteProject(id);
  }

  @Put('restore/:id')
  @UseGuards(JwtGuard)
  async restoreProject(@Param('id') id: number) {
    return await this.projectService.restoreProject(id);
  }
}
