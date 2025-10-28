import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NotFoundError, UniqueConstraintError } from '../../common/error';
import {
  CreateBoardDto,
  UpdateBoardDto,
} from '../../dto/boardDTO/create-board.dto';
import { Board, Card } from '../../entities/board.entity';
import { PrismaEntityMapper } from '../../mappers/prisma-entity.mapper';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BoardRepository {
  constructor(private prisma: PrismaService) {}

  async createBoard(data: CreateBoardDto): Promise<Board> {
    try {
      const prismaResult = await this.prisma.board.create({ data });
      return PrismaEntityMapper.toBoardEntity(prismaResult);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UniqueConstraintError(
          `Board with ID "${data.uniqueHashedId}" already exists.`,
        );
      }
      throw error;
    }
  }
  async updateBoard(
    uniqueHashedId: string,
    data: UpdateBoardDto,
  ): Promise<Board> {
    try {
      const prismaResult = await this.prisma.board.update({
        where: { uniqueHashedId },
        data,
      });

      return PrismaEntityMapper.toBoardEntity(prismaResult);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(`Board with ID "${uniqueHashedId}" not found.`);
      }
      throw error;
    }
  }
  async findByUniqueId(
    uniqueHashedId: string,
  ): Promise<(Board & { cards: Card[] }) | null> {
    const prismaResult = await this.prisma.board.findUnique({
      where: { uniqueHashedId },
      include: {
        cards: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });

    if (!prismaResult) {
      return null;
    }
    return PrismaEntityMapper.toBoardEntity(prismaResult) as Board & {
      cards: Card[];
    };
  }

  async deleteBoard(id: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.card.deleteMany({
          where: { boardId: id },
        });

        await prisma.board.delete({ where: { id } });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('The requested board does not exist');
      }
      throw error;
    }
  }
}
