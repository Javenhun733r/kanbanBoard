import { Injectable } from '@nestjs/common';
import {
  NotFoundError,
  UniqueConstraintError,
} from '../../common/errors/error';
import {
  CreateBoardDto,
  UpdateBoardDto,
} from '../../dto/boardDTO/create-board.dto';
import { Board } from '../../entities/board.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaEntityMapper } from '../mappers/prisma-entity.mapper';

@Injectable()
export class BoardRepository {
  constructor(private prisma: PrismaService) {}
  async getAllBoardsUniqueHashId(): Promise<string[]> {
    const boards = await this.prisma.board.findMany({
      select: {
        uniqueHashedId: true,
      },
    });
    return boards.map((board) => board.uniqueHashedId);
  }
  async createBoard(data: CreateBoardDto): Promise<Board> {
    const prismaResult = await this.prisma.board.create({ data }).catch(() => {
      throw new UniqueConstraintError(
        `Board with ID "${data.uniqueHashedId}" already exists.`,
      );
    });
    return PrismaEntityMapper.toBoardEntity(prismaResult);
  }
  async updateBoard(
    uniqueHashedId: string,
    data: UpdateBoardDto,
  ): Promise<Board> {
    const prismaResult = await this.prisma.board
      .update({
        where: { uniqueHashedId },
        data,
      })
      .catch(() => {
        throw new NotFoundError(`Board with ID "${uniqueHashedId}" not found.`);
      });

    return PrismaEntityMapper.toBoardEntity(prismaResult);
  }
  async findByUniqueId(uniqueHashedId: string): Promise<Board> {
    const prismaResult = await this.prisma.board
      .findUniqueOrThrow({
        where: { uniqueHashedId },
        include: {
          cards: {
            orderBy: {
              orderIndex: 'asc',
            },
          },
        },
      })
      .catch(() => {
        throw new NotFoundError(`Board with ID "${uniqueHashedId}" not found.`);
      });
    return PrismaEntityMapper.toBoardEntity(prismaResult);
  }
  private async getBoardIdByHashedId(uniqueHashedId: string): Promise<string> {
    const board = await this.findByUniqueId(uniqueHashedId);
    return board.id;
  }
  async deleteBoard(uniqueHashedId: string): Promise<void> {
    const boardId = await this.getBoardIdByHashedId(uniqueHashedId);
    await this.prisma
      .$transaction(async (prisma) => {
        await prisma.card.deleteMany({
          where: { boardId },
        });

        await prisma.board.delete({ where: { id: boardId } });
      })
      .catch(() => {
        throw new NotFoundError(`Board with ID "${boardId}" not found.`);
      });
  }
}
