import { Controller, Get, Param } from '@nestjs/common';
import { MemberService } from './member.service';
import { GetLeaderInfo } from './entities/get-leader-info.entity';

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get('/leader/:projectId')
  async getLeaderInfoByProjectId(
    @Param('projectId') projectId: number,
  ): Promise<GetLeaderInfo> {
    return await this.memberService.findLeaderInfoByProjectId(projectId);
  }
}
