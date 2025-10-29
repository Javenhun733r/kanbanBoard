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

import { BoardRepository } from './repository/board.repository';
import { CardRepository } from './repository/card.repository';

type BoardWithCards = Board & { cards: Card[] };

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
    return this.boardRepository.updateBoard(uniqueHashedId, data);
  }

  async getBoardWithCards(uniqueHashedId: string): Promise<BoardWithCards> {
    const board = await this.boardRepository.findByUniqueId(uniqueHashedId);

    if (!board) {
      throw new NotFoundException(
        `Board with ID "${uniqueHashedId}" not found.`,
      );
    }
    return board as BoardWithCards;
  }

  async deleteBoard(board: Board): Promise<void> {
    await this.boardRepository.deleteBoard(board.id);
  }

  async createCard(board: Board, data: CreateCardDto): Promise<Card> {
    return this.cardRepository.createCard(board.id, data);
  }

  async updateCardPosition(
    board: Board,
    dto: UpdateCardPositionDto,
  ): Promise<Card> {
    const card = await this.cardRepository.findCardById(dto.cardId);
    if (!card || card.boardId !== board.id) {
      throw new NotFoundException(
        `Card not found or does not belong to board ${board.uniqueHashedId}.`,
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

  async updateCard(cardId: string, data: UpdateCardDto): Promise<Card> {
    return this.cardRepository.updateCard(cardId, data);
  }
  async deleteCard(cardId: string): Promise<void> {
    await this.cardRepository.deleteCard(cardId);
  }
}
