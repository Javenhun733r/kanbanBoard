import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateBoardDto,
  CreateCardDto,
  UpdateBoardDto,
  UpdateCardDto,
  UpdateCardPositionDto,
} from '../dto/index.dto';
import { Board, Card, ColumnStatus } from '../entities/board.entity';

import { NotFoundError } from '../common/error';
import { BoardRepository } from './repository/board.repository';
import { CardRepository } from './repository/card.repository';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly cardRepository: CardRepository,
  ) {}

  async createBoard(data: CreateBoardDto): Promise<Board> {
    return this.boardRepository.createBoard(data);
  }
  async updateBoard(
    uniqueHashedId: string,
    data: UpdateBoardDto,
  ): Promise<Board> {
    try {
      return this.boardRepository.updateBoard(uniqueHashedId, data);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
  async getBoardWithCards(
    uniqueHashedId: string,
  ): Promise<Board & { cards: Card[] }> {
    const board = await this.boardRepository.findByUniqueId(uniqueHashedId);

    if (!board) {
      throw new NotFoundException(
        `Board with ID "${uniqueHashedId}" not found.`,
      );
    }
    return board;
  }

  async deleteBoard(uniqueHashedId: string): Promise<void> {
    const board = await this.boardRepository.findByUniqueId(uniqueHashedId);

    if (!board) {
      throw new NotFoundException(
        `Board with ID "${uniqueHashedId}" not found.`,
      );
    }

    await this.boardRepository.deleteBoard(board.id);
  }

  async createCard(uniqueHashedId: string, data: CreateCardDto): Promise<Card> {
    const board = await this.boardRepository.findByUniqueId(uniqueHashedId);

    if (!board) {
      throw new NotFoundException(
        `Board with ID "${uniqueHashedId}" not found.`,
      );
    }

    return this.cardRepository.createCard(board.id, data);
  }

  async updateCard(cardId: string, data: UpdateCardDto): Promise<Card> {
    try {
      return this.cardRepository.updateCard(cardId, data);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  async deleteCard(cardId: string): Promise<void> {
    try {
      await this.cardRepository.deleteCard(cardId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  async updateCardPosition(
    uniqueHashedId: string,
    dto: UpdateCardPositionDto,
  ): Promise<Card> {
    const board = await this.boardRepository.findByUniqueId(uniqueHashedId);
    if (!board) {
      throw new NotFoundException(
        `Board with ID "${uniqueHashedId}" not found.`,
      );
    }

    const card = await this.cardRepository.findCardById(dto.cardId);
    if (!card || card.boardId !== board.id) {
      throw new NotFoundException(
        `Card not found or does not belong to board ${uniqueHashedId}.`,
      );
    }

    try {
      const updatedCard = await this.cardRepository.updateCardPosition(
        card.id,
        card.column,
        dto.newColumn as ColumnStatus,
        card.orderIndex,
        dto.newOrderIndex,
        board.id,
      );
      return updatedCard;
    } catch (error) {
      console.error('Card movement transaction error:', error);
      throw new InternalServerErrorException(
        'Error moving card. Please try again later.',
      );
    }
  }
}
