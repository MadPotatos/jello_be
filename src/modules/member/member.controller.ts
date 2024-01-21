import { Controller, Get, Param } from '@nestjs/common';
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
}
