import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardRepository } from './repository/board.repository';
import { CardRepository } from './repository/card.repository';

@Module({
  controllers: [BoardController],
  providers: [BoardService, BoardRepository, CardRepository],
  imports: [PrismaModule],
})
export class BoardModule {}
