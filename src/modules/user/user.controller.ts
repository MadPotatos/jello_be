import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //@UseGuards(JwtGuard)
  @Get(':id')
  async getUserProfile(@Param('id') id: number) {
    return await this.userService.findProfile(id);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  async updateUserInfo(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return await this.userService.updateInfo(id, body);
  }

  @UseGuards(JwtGuard)
  @Put(':id/avatar')
  async updateUserAvatar(@Param('id') id: number, @Body() body: any) {
    return await this.userService.updateAvatar(id, body);
  }
}
