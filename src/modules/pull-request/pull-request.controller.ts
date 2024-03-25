import { Controller, Get, Param, Res } from '@nestjs/common';
import { PullRequestService } from './pull-request.service';
import { V1PullRequestList } from './entities/get-pull-requests-list.entity';

@Controller('pull-request')
export class PullRequestController {
  constructor(private readonly pullRequestsService: PullRequestService) {}

  @Get(':owner/:repo')
  async getPullRequests(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ): Promise<V1PullRequestList> {
    return this.pullRequestsService.getPullRequests(owner, repo);
  }
}
