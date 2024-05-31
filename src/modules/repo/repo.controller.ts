import { Controller, Get, Param } from '@nestjs/common';
import { V1PullRequest } from './entities/get-pull-requests-list.entity';
import { RepositoryService } from './repo.service';
import { V1RepoDetail } from './entities/get-repo-detail.entity';

@Controller('repo')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Get('pull-requests/:id')
  async getPullRequests(@Param('id') id: number): Promise<V1PullRequest[]> {
    return this.repositoryService.getPullRequests(id);
  }

  @Get('detail/:id')
  async getRepositoryInfo(@Param('id') id: number): Promise<V1RepoDetail> {
    return this.repositoryService.getRepositoryInfo(id);
  }
}
