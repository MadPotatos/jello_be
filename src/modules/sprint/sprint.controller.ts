import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SprintService } from './sprint.service';
import { V1Sprint } from './entities/get-sprint.entity';

@Controller('sprint')
export class SprintController {
  constructor(private sprintService: SprintService) {}

  @Get(':projectId')
  async getSprintsInProject(
    @Param('projectId') projectId: number,
  ): Promise<V1Sprint[]> {
    return this.sprintService.getSprintsInProject(projectId);
  }

  @Post()
  async createSprint(@Body() body: { projectId: number }) {
    return this.sprintService.createSprint(body.projectId);
  }

  @Put(':id')
  async updateSprint(@Param('id') id: number, @Body() body: any) {
    return this.sprintService.updateSprint(id, body);
  }

  @Delete(':id')
  async deleteSprint(@Param('id') id: number) {
    return this.sprintService.deleteSprint(id);
  }
}
