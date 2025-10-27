import { Injectable } from '@nestjs/common';
import { Prisma, ColumnStatus as PrismaColumnStatus } from '@prisma/client';
import { NotFoundError } from '../../common/error';
import { CreateCardDto } from '../../dto/cardDTO/create-card.dto';
import { UpdateCardDto } from '../../dto/cardDTO/update-card.dto';
import { Card, ColumnStatus } from '../../entities/board.entity';
import { PrismaEntityMapper } from '../../mappers/prisma-entity.mapper';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CardRepository {
  constructor(private prisma: PrismaService) {}

  async findCardById(cardId: string): Promise<Card | null> {
    const prismaResult = await this.prisma.card.findUnique({
      where: { id: cardId },
    });
    return prismaResult ? PrismaEntityMapper.toCardEntity(prismaResult) : null;
  }

  async createCard(boardId: string, data: CreateCardDto): Promise<Card> {
    const maxOrderCard = await this.prisma.card.findFirst({
      where: {
        boardId: boardId,
        column: data.column as PrismaColumnStatus,
      },
      orderBy: { orderIndex: 'desc' },
    });

    const newOrderIndex = maxOrderCard ? maxOrderCard.orderIndex + 1 : 0;

    const prismaResult = await this.prisma.card.create({
      data: {
        ...data,
        description: data.description || '',
        boardId: boardId,
        orderIndex: newOrderIndex,
        column: data.column as PrismaColumnStatus,
      },
    });

    return PrismaEntityMapper.toCardEntity(prismaResult);
  }

  async updateCard(cardId: string, data: UpdateCardDto): Promise<Card> {
    try {
      const prismaResult = await this.prisma.card.update({
        where: { id: cardId },
        data: {
          ...data,
          column: data.column as PrismaColumnStatus,
          updatedAt: new Date(),
        },
      });
      return PrismaEntityMapper.toCardEntity(prismaResult);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(
          `Картка з ID ${cardId} не знайдена для оновлення.`,
        );
      }
      throw error;
    }
  }

  async deleteCard(cardId: string): Promise<void> {
    try {
      await this.prisma.card.delete({ where: { id: cardId } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(
          `Картка з ID ${cardId} не знайдена для видалення.`,
        );
      }
      throw error;
    }
  }

  async updateCardPosition(
    cardId: string,
    oldColumn: ColumnStatus,
    newColumn: ColumnStatus,
    oldOrderIndex: number,
    newOrderIndex: number,
    boardId: string,
  ): Promise<Card> {
    return this.prisma.$transaction(async (prisma) => {
      if (oldColumn === newColumn) {
        if (newOrderIndex > oldOrderIndex) {
          await prisma.card.updateMany({
            where: {
              boardId: boardId,
              column: oldColumn,
              orderIndex: { gt: oldOrderIndex, lte: newOrderIndex },
              id: { not: cardId },
            },
            data: { orderIndex: { decrement: 1 } },
          });
        } else if (newOrderIndex < oldOrderIndex) {
          await prisma.card.updateMany({
            where: {
              boardId: boardId,
              column: oldColumn,
              orderIndex: { gte: newOrderIndex, lt: oldOrderIndex },
              id: { not: cardId },
            },
            data: { orderIndex: { increment: 1 } },
          });
        }
      } else {
        await prisma.card.updateMany({
          where: {
            boardId: boardId,
            column: oldColumn,
            orderIndex: { gt: oldOrderIndex },
          },
          data: { orderIndex: { decrement: 1 } },
        });
        await prisma.card.updateMany({
          where: {
            boardId: boardId,
            column: newColumn,
            orderIndex: { gte: newOrderIndex },
          },
          data: { orderIndex: { increment: 1 } },
        });
      }
      const prismaResult = await prisma.card.update({
        where: { id: cardId },
        data: {
          column: newColumn as PrismaColumnStatus,
          orderIndex: newOrderIndex,
          updatedAt: new Date(),
        },
      });

      return PrismaEntityMapper.toCardEntity(prismaResult);
    });
  }
}
