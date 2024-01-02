import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ListController],
  providers: [ListService, PrismaService],
})
export class ListModule {}
