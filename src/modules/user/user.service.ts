import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/dto/user.dto';
import { hash } from 'bcrypt';
import { UserProfile } from './entities/user-profile.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) throw new ConflictException('email duplicated');

    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: await hash(dto.password, 10),
      },
    });

    const { password, ...result } = newUser;
    return result;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
  async findProfile(id: number): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) throw new ConflictException('user not found');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
  }

  async updateInfo(id: number, body: UpdateUserDto): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (user) throw new ConflictException('email duplicated');
    const updatedUserRaw = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...body,
      },
    });

    return {
      id: updatedUserRaw.id,
      name: updatedUserRaw.name,
      email: updatedUserRaw.email,
      avatar: updatedUserRaw.avatar,
    };
  }
}
