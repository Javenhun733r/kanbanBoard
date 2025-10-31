import { PrismaEntityMapper } from '@app/board/mappers/prisma-entity.mapper';
import { NotFoundError } from '@app/common/errors/error';
import { generateHashedId } from '@app/common/utils/id.utils';
import { BoardDto } from '@app/dto/boardDTO/board.dto';
import { Board } from '@app/entities/board.entity';
import { PrismaService } from '@app/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
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
  async createBoard(data: BoardDto): Promise<Board> {
    const uniqueHashedId = generateHashedId();
    const prismaResult = await this.prisma.board
      .create({
        data: {
          name: data.name,
          uniqueHashedId,
        },
      })
      .catch(() => {
        throw new ConflictException(
          'Could not create board due to a unique identifier conflict. Please try again.',
        );
      });
    return PrismaEntityMapper.toBoardEntity(prismaResult);
  }
  async updateBoard(uniqueHashedId: string, data: BoardDto): Promise<Board> {
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
