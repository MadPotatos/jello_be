import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { GetMember, GetMemberList } from './entities/get-member.entity';
import { Role } from '@prisma/client';

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

  @Delete('/:projectId/:userId')
  async removeMember(
    @Param('projectId') projectId: number,
    @Param('userId') userId: number,
  ): Promise<any> {
    return await this.memberService.removeMember(projectId, userId);
  }

  @Put('role/:projectId/:userId')
  async updateRole(
    @Param('projectId') projectId: number,
    @Param('userId') userId: number,
    @Body('role') role: Role,
  ): Promise<any> {
    return await this.memberService.updateRole(projectId, userId, role);
  }

  @Get('/:role/:projectId')
  async getMembersByRole(
    @Param('projectId') projectId: number,
    @Param('role') role: Role,
  ): Promise<GetMemberList> {
    return await this.memberService.getMemberByRole(projectId, role);
  }

  @Get('/checkRole/:projectId/:userId')
  async checkRole(
    @Param('projectId') projectId: number,
    @Param('userId') userId: number,
  ): Promise<any> {
    return await this.memberService.checkRole(projectId, userId);
  }
}
