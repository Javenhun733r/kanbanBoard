import { Module } from '@nestjs/common';
import { BoardModule } from '@app/board/board.module';
import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
  imports: [PrismaModule, BoardModule],
})
export class AppModule {}
