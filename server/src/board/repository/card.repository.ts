import { PrismaEntityMapper } from '@app/board/mappers/prisma-entity.mapper';
import { NotFoundError } from '@app/common/errors/error';
import {
  getShiftParameters,
  updateOrderIndices,
} from '@app/common/utils/order.utils';
import { CreateCardDto, UpdateCardDto } from '@app/dto/cardDTO/create-card.dto';
import { UpdateCardPositionDto } from '@app/dto/index.dto';
import { Card, ColumnStatus } from '@app/entities/board.entity';
import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, ColumnStatus as PrismaColumnStatus } from '@prisma/client';
@Injectable()
export class CardRepository {
  constructor(private prisma: PrismaService) {}

  async findCardById(cardId: string): Promise<Card> {
    const prismaResult = await this.prisma.card
      .findUniqueOrThrow({
        where: { id: cardId },
      })
      .catch(() => {
        throw new NotFoundError(`Card with ${cardId} doesn't exists`);
      });
    return PrismaEntityMapper.toCardEntity(prismaResult);
  }
  private async getNextOrderIndex(
    boardId: string,
    column: PrismaColumnStatus,
  ): Promise<number> {
    const maxOrderCard = await this.prisma.card.findFirst({
      where: {
        boardId: boardId,
        column: column,
      },
      orderBy: { orderIndex: 'desc' },
    });
    return maxOrderCard ? maxOrderCard.orderIndex + 1 : 0;
  }
  async createCard(boardId: string, data: CreateCardDto): Promise<Card> {
    const columnStatus = data.column;
    const nextOrderIndex = await this.getNextOrderIndex(boardId, columnStatus);
    const prismaResult = await this.prisma.card.create({
      data: {
        ...data,
        description: data.description || '',
        boardId: boardId,
        orderIndex: nextOrderIndex,
        column: columnStatus,
      },
    });

    return PrismaEntityMapper.toCardEntity(prismaResult);
  }

  async updateCard(cardId: string, data: UpdateCardDto): Promise<Card> {
    const prismaResult = await this.prisma.card
      .update({
        where: { id: cardId },
        data: {
          ...data,
          column: data.column,
          updatedAt: new Date(),
        },
      })
      .catch(() => {
        throw new NotFoundError(`Card with ID ${cardId} not found for update.`);
      });
    return PrismaEntityMapper.toCardEntity(prismaResult);
  }

  async deleteCard(cardId: string): Promise<void> {
    await this.prisma.card.delete({ where: { id: cardId } }).catch(() => {
      throw new NotFoundError(`Card with ID ${cardId} not found for deletion.`);
    });
  }
  private async handleOrderUpdates(
    prisma: Prisma.TransactionClient,
    cardId: string,
    boardId: string,
    oldColumn: ColumnStatus,
    newColumn: ColumnStatus,
    oldOrderIndex: number,
    newOrderIndex: number,
  ): Promise<void> {
    if (oldOrderIndex === newOrderIndex && oldColumn === newColumn) {
      return;
    }

    if (oldColumn === newColumn) {
      const shift = getShiftParameters(oldOrderIndex, newOrderIndex);

      if (shift) {
        await updateOrderIndices(
          prisma,
          boardId,
          oldColumn,
          shift.orderIndexCondition,
          shift.action,
          cardId,
        );
      }
    } else {
      await updateOrderIndices(
        prisma,
        boardId,
        oldColumn,
        { gt: oldOrderIndex },
        'decrement',
      );

      await updateOrderIndices(
        prisma,
        boardId,
        newColumn,
        { gte: newOrderIndex },
        'increment',
      );
    }
  }
  async updateCardPosition(
    dto: UpdateCardPositionDto,
    boardId: string,
  ): Promise<Card> {
    return this.prisma.$transaction(async (prisma) => {
      const card = await this.findCardById(dto.cardId);
      await this.handleOrderUpdates(
        prisma,
        card.id,
        boardId,
        card.column,
        dto.newColumn as ColumnStatus,
        card.orderIndex,
        dto.newOrderIndex,
      );
      const prismaResult = await prisma.card.update({
        where: { id: card.id },
        data: {
          column: dto.newColumn,
          orderIndex: dto.newOrderIndex,
        },
      });

      return PrismaEntityMapper.toCardEntity(prismaResult);
    });
  }
}
