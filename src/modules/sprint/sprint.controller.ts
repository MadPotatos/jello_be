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
import { SprintService } from './sprint.service';
import { V1Sprint } from './entities/get-sprint.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('sprint')
export class SprintController {
  constructor(private sprintService: SprintService) {}

  @Get(':projectId')
  async getSprintsInProject(
    @Param('projectId') projectId: number,
  ): Promise<V1Sprint[]> {
    return this.sprintService.getSprintsInProject(projectId);
  }

  @Get('remain/:projectId')
  async getNotInProgressSprints(@Param('projectId') projectId: number) {
    return this.sprintService.getNotInProgressSprints(projectId);
  }

  @Post()
  @UseGuards(JwtGuard)
  async createSprint(@Body() body: { projectId: number }) {
    return this.sprintService.createSprint(body.projectId);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateSprint(@Param('id') id: number, @Body() body: any) {
    return this.sprintService.updateSprint(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteSprint(@Param('id') id: number) {
    return this.sprintService.deleteSprint(id);
  }

  @Put(':id/complete')
  @UseGuards(JwtGuard)
  async completeSprint(@Param('id') id: number, @Body() body: any) {
    return this.sprintService.completeSprint(id, body);
  }
}
