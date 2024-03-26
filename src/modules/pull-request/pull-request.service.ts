import { ConflictException, Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { V1PullRequestList } from './entities/get-pull-requests-list.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PullRequestService {
  constructor(private prisma: PrismaService) {}

  async getPullRequests(id: number): Promise<V1PullRequestList> {
    const octokit = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN,
    });

    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { repo: true },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const { owner, repo } = await this.getOwnerAndRepoFromUrl(project.repo);

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
      throw new Error('Failed to fetch pull requests');
    }
  }

  private async getOwnerAndRepoFromUrl(url: string) {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?$/;
    const match = url.match(regex);

    if (match) {
      return {
        owner: match[1],
        repo: match[2],
      };
    } else {
      throw new ConflictException('Invalid repository URL');
    }
  }
}
