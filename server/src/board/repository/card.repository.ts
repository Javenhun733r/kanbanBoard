import { Injectable } from '@nestjs/common';
import { Prisma, ColumnStatus as PrismaColumnStatus } from '@prisma/client';
import { UpdateCardPositionDto } from 'src/dto/index.dto';
import { NotFoundError } from '../../common/errors/error';
import {
  getShiftParameters,
  updateOrderIndices,
} from '../../common/utils/order-utils';
import {
  CreateCardDto,
  UpdateCardDto,
} from '../../dto/cardDTO/create-card.dto';
import { Card, ColumnStatus } from '../../entities/board.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaEntityMapper } from '../mappers/prisma-entity.mapper';
@Injectable()
export class CardRepository {
  constructor(private prisma: PrismaService) {}

  async findCardById(cardId: string): Promise<Card> {
    const prismaResult = await this.prisma.card
      .findUnique({
        where: { id: cardId },
      })
      .catch(() => {
        throw new NotFoundError(`Card with ${cardId} doesn't exists`);
      });
    return PrismaEntityMapper.toCardEntity(prismaResult!);
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
    const card = await this.findCardById(dto.cardId);
    return this.prisma.$transaction(async (prisma) => {
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
          updatedAt: new Date(),
        },
      });

      return PrismaEntityMapper.toCardEntity(prismaResult);
    });
  }
}
