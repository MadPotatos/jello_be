import { ConflictException, Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { V1PullRequest } from './entities/get-pull-requests-list.entity';
import { PrismaService } from 'src/prisma.service';
import { V1RepoDetail } from './entities/get-repo-detail.entity';

@Injectable()
export class RepositoryService {
  constructor(private prisma: PrismaService) {}

  async getPullRequests(id: number): Promise<V1PullRequest[]> {
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
      return pullRequests;
    } catch (error) {
      console.log(error);
    }
  }

  async getRepositoryInfo(id: number): Promise<V1RepoDetail> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { repo: true },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const { owner, repo } = await this.getOwnerAndRepoFromUrl(project.repo);

    try {
      const octokit = new Octokit({
        auth: process.env.GITHUB_ACCESS_TOKEN,
      });

      const repoInfo = await octokit.repos.get({
        owner,
        repo,
      });

      return {
        name: repoInfo.data.name,
        owner: repoInfo.data.owner.login,
        description: repoInfo.data.description,
        url: repoInfo.data.html_url,
        language: repoInfo.data.language,
        forks: repoInfo.data.forks_count,
        stars: repoInfo.data.stargazers_count,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async testing() {}

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
