import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma/prisma.module';
import { BoardController } from '@app/board/board.controller';
import { BoardService } from '@app/board/board.service';
import { BoardRepository } from '@app/board/repository/board.repository';
import { CardRepository } from '@app/board/repository/card.repository';

@Module({
  controllers: [BoardController],
  providers: [BoardService, BoardRepository, CardRepository],
  imports: [PrismaModule],
})
export class BoardModule {}
