import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/dto/user.dto';
import { hash } from 'bcrypt';
import { GetUserByName, UserProfile } from './entities/user-profile.entity';

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
      job: user.job,
      organization: user.organization,
    };
  }

  async updateInfo(id: number, body: UpdateUserDto): Promise<UserProfile> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (body.email && body.email !== existingUser.email) {
      const userWithSameEmail = await this.prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (userWithSameEmail) {
        throw new ConflictException('Email already taken');
      }
    }

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
      job: updatedUserRaw.job,
      organization: updatedUserRaw.organization,
    };
  }

  async updateAvatar(id: number, body: any) {
    const updatedUserRaw = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        avatar: body.avatar,
      },
    });

    return {
      avatar: updatedUserRaw.avatar,
    };
  }

  async getUserByNames(name: string): Promise<any> {
    const users = await this.prisma.user.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });

    return {
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        job: user.job,
        organization: user.organization,
      })),
      total: users.length,
    };
  }
}
