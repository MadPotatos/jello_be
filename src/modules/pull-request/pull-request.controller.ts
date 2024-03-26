import { Controller, Get, Param, Res } from '@nestjs/common';
import { PullRequestService } from './pull-request.service';
import { V1PullRequestList } from './entities/get-pull-requests-list.entity';

@Controller('pull-request')
export class PullRequestController {
  constructor(private readonly pullRequestsService: PullRequestService) {}

  @Get(':project/:id')
  async getPullRequests(@Param('id') id: number): Promise<V1PullRequestList> {
    return this.pullRequestsService.getPullRequests(id);
  }
}
