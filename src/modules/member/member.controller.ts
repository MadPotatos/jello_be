import { Controller, Get, Param, Post } from '@nestjs/common';
import { MemberService } from './member.service';
import { GetMember, GetMemberList } from './entities/get-member.entity';

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get('/leader/:projectId')
  async getLeaderInfoByProjectId(
    @Param('projectId') projectId: number,
  ): Promise<GetMember> {
    return await this.memberService.getLeaderByProjectId(projectId);
  }

  @Get('/:projectId')
  async getMembersByProjectId(
    @Param('projectId') projectId: number,
  ): Promise<GetMemberList> {
    return await this.memberService.getMembersByProjectId(projectId);
  }

  @Post('/:projectId/:userId')
  async addMember(
    @Param('projectId') projectId: number,
    @Param('userId') userId: number,
  ): Promise<any> {
    return await this.memberService.addMember(projectId, userId);
  }

  @Get('/check/:projectId/:userId')
  async checkMember(
    @Param('projectId') projectId: number,
    @Param('userId') userId: number,
  ): Promise<boolean> {
    return await this.memberService.checkMemberInProject(projectId, userId);
  }
}
