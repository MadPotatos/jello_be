import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ListService } from './list.service';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get(':projectId')
  async getListsInProject(@Param('projectId') projectId: number) {
    return this.listService.getListsInProject(projectId);
  }

  @Post()
  async createList(@Body() body: { projectId: number }) {
    return this.listService.createList(body.projectId);
  }

  @Put(':id')
  async updateList(@Param('id') id: number, @Body() body: any) {
    return this.listService.updateList(id, body);
  }

  @Delete(':id')
  async deleteList(@Param('id') id: number) {
    return this.listService.deleteList(id);
  }

  @Post('reorder')
  async reorderLists(@Body() body: any) {
    return this.listService.reorderLists(body);
  }
}
