import { Module } from '@nestjs/common';
import { BoardModule } from './board/board.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, BoardModule],
})
export class AppModule {}
