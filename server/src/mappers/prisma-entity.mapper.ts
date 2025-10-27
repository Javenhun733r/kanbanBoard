import { Board as PrismaBoard, Card as PrismaCard } from '@prisma/client';
import {
  Board,
  BoardEntity,
  Card,
  ColumnStatus,
} from '../entities/board.entity';

export class PrismaEntityMapper {
  static toCardEntity = (prismaCard: PrismaCard): Card => {
    return {
      id: prismaCard.id,
      boardId: prismaCard.boardId,
      title: prismaCard.title,
      description: prismaCard.description,
      column: prismaCard.column as ColumnStatus,
      orderIndex: prismaCard.orderIndex,
      createdAt: prismaCard.createdAt,
      updatedAt: prismaCard.updatedAt,
    };
  };
  static toBoardEntity(
    prismaBoard: PrismaBoard & { cards?: PrismaCard[] },
  ): Board {
    const boardEntity: BoardEntity = {
      id: prismaBoard.id,
      uniqueHashedId: prismaBoard.uniqueHashedId,
      name: prismaBoard.name,
      createdAt: prismaBoard.createdAt,
      updatedAt: prismaBoard.updatedAt,
      cards: prismaBoard.cards
        ? prismaBoard.cards.map(PrismaEntityMapper.toCardEntity)
        : undefined,
    };
    return boardEntity;
  }
}
