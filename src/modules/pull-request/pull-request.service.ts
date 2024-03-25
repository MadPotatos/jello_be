import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { V1PullRequestList } from './entities/get-pull-requests-list.entity';

@Injectable()
export class PullRequestService {
  constructor() {}

  async getPullRequests(
    owner: string,
    repo: string,
  ): Promise<V1PullRequestList> {
    const octokit = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN,
    });

    try {
      const rawPullRequests = await octokit.pulls.list({
        owner,
        repo,
      });
      const pullRequests = rawPullRequests.data.map((pullRequest) => ({
        id: pullRequest.id,
        title: pullRequest.title,
        user: pullRequest.user.login,
        url: pullRequest.html_url,
        state: pullRequest.state,
        createdAt: pullRequest.created_at,
        head: pullRequest.head.label,
        base: pullRequest.base.label,
      }));
      return { pullRequests, total: pullRequests.length };
    } catch (error) {
      console.error('Error fetching pull requests:', error);
      throw new Error('Failed to fetch pull requests');
    }
  }
}
