import { ConflictException, Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { V1PullRequest } from './entities/get-pull-requests-list.entity';
import { PrismaService } from 'src/prisma.service';
import { V1RepoDetail } from './entities/get-repo-detail.entity';
import { Cron } from '@nestjs/schedule';
import { IssuePriority, IssueType } from '@prisma/client';

@Injectable()
export class RepositoryService {
  constructor(private prisma: PrismaService) {}

  @Cron('*/1 * * * *') // Check for new pull requests every 1 minutes
  async checkForNewPullRequests() {
    const projects = await this.prisma.project.findMany({
      where: { isDeleted: false },
      select: { id: true, repo: true },
    });

    for (const project of projects) {
      await this.processPullRequests(project.id, project.repo);
    }
  }

  private async processPullRequests(projectId: number, repoUrl: string) {
    const octokit = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN,
    });

    const { owner, repo } = await this.getOwnerAndRepoFromUrl(repoUrl);
    if (!owner || !repo) {
      return;
    }

    try {
      const rawPullRequests = await octokit.pulls.list({
        owner,
        repo,
      });

      for (const pullRequest of rawPullRequests.data) {
        const description = `New pull request: ${pullRequest.title}`;
        const existingIssue = await this.prisma.issue.findFirst({
          where: {
            projectId,
            descr: { startsWith: description },
          },
        });

        if (!existingIssue) {
          await this.createIssueFromPullRequest(projectId, pullRequest);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async createIssueFromPullRequest(
    projectId: number,
    pullRequest: any,
  ) {
    const firstList = await this.prisma.list.findFirst({
      where: { projectId },
      orderBy: { order: 'asc' },
    });

    if (!firstList) {
      throw new Error('No list found for the project');
    }

    const highestOrderIssue = await this.prisma.issue.findFirst({
      where: { listId: firstList.id },
      orderBy: { listOrder: 'desc' },
    });

    const newOrder = highestOrderIssue ? highestOrderIssue.listOrder + 1 : 1;

    const descriptionHtml = `
      <h3>${pullRequest.title}</h3>
      <p>From: ${pullRequest.user.login}</p>
      <a href="${pullRequest.html_url}" target="_blank">View Pull Request</a>
    `;

    await this.prisma.issue.create({
      data: {
        summary: pullRequest.title,
        descr: descriptionHtml,
        listId: firstList.id ?? undefined,
        listOrder: newOrder,
        priority: IssuePriority.MEDIUM,
        type: IssueType.REVIEW,
        projectId,
        reporterId: 1,
      },
    });
  }

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
