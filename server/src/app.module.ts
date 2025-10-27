import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [PrismaModule, BoardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
