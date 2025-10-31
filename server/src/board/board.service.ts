import {
  CreateBoardDto,
  CreateCardDto,
  UpdateBoardDto,
  UpdateCardDto,
  UpdateCardPositionDto,
} from '@app/dto/index.dto';
import { Board, Card } from '@app/entities/board.entity';
import { Injectable } from '@nestjs/common';

import { BoardRepository } from '@app/board/repository/board.repository';
import { CardRepository } from '@app/board/repository/card.repository';

type BoardWithCards = Board & { cards: Card[] };

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly cardRepository: CardRepository,
  ) {}
  createBoard(data: CreateBoardDto): Promise<Board> {
    return this.boardRepository.createBoard(data);
  }
  getAllBoardsUniqueHashId(): Promise<string[]> {
    return this.boardRepository.getAllBoardsUniqueHashId();
  }
  updateBoard(uniqueHashedId: string, data: UpdateBoardDto): Promise<Board> {
    return this.boardRepository.updateBoard(uniqueHashedId, data);
  }

  async getBoardWithCards(uniqueHashedId: string): Promise<BoardWithCards> {
    const board = await this.boardRepository.findByUniqueId(uniqueHashedId);
    return board as BoardWithCards;
  }
  async deleteBoard(uniqueHashedId: string): Promise<void> {
    await this.boardRepository.deleteBoard(uniqueHashedId);
  }
  async createCard(uniqueHashedId: string, data: CreateCardDto): Promise<Card> {
    const board = await this.boardRepository.findByUniqueId(uniqueHashedId);
    return this.cardRepository.createCard(board.id, data);
  }
  async updateCardPosition(
    uniqueHashedId: string,
    dto: UpdateCardPositionDto,
  ): Promise<Card> {
    const board = await this.boardRepository.findByUniqueId(uniqueHashedId);

    const updatedCard = await this.cardRepository.updateCardPosition(
      dto,
      board.id,
    );
    return updatedCard;
  }

  async updateCard(cardId: string, data: UpdateCardDto): Promise<Card> {
    return this.cardRepository.updateCard(cardId, data);
  }
  async deleteCard(cardId: string): Promise<void> {
    await this.cardRepository.deleteCard(cardId);
  }
}
