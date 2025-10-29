import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BoardFromRequest } from '../common/decorators/board.decorator';
import { BoardExistsGuard } from '../common/guards/board-exists.guard';
import * as requestWithBoardInterface from '../common/interfaces/request-with-board.interface';
import type { Board, Card } from '../entities/board.entity';

import { BoardMapper } from '../common/mappers/board.mapper';
import {
  CreateBoardDto,
  CreateCardDto,
  UpdateBoardDto,
  UpdateCardDto,
  UpdateCardPositionDto,
} from '../dto/index.dto';
import { BoardResponseDto } from '../dto/response.dto';
import { BoardService } from './board.service';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardResponseDto> {
    const boardEntity = await this.boardService.createBoard(createBoardDto);
    return BoardMapper.toBoardResponseDto({ ...boardEntity, cards: [] });
  }

  @Get(':uniqueHashedId')
  @UseGuards(BoardExistsGuard)
  async getBoard(
    @BoardFromRequest() board: requestWithBoardInterface.BoardWithCards,
  ): Promise<BoardResponseDto> {
    const boardWithCards = await this.boardService.getBoardWithCards(
      board.uniqueHashedId,
    );
    return BoardMapper.toBoardResponseDto(boardWithCards);
  }

  @Put(':uniqueHashedId')
  @UseGuards(BoardExistsGuard)
  async updateBoard(
    @BoardFromRequest() board: Board,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<BoardResponseDto> {
    const updatedBoard = await this.boardService.updateBoard(
      board.uniqueHashedId,
      updateBoardDto,
    );
    return BoardMapper.toBoardResponseDto({ ...updatedBoard, cards: [] });
  }

  @Delete(':uniqueHashedId')
  @UseGuards(BoardExistsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBoard(@BoardFromRequest() board: Board): Promise<void> {
    await this.boardService.deleteBoard(board);
  }

  @Post(':uniqueHashedId/cards')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(BoardExistsGuard)
  async createCard(
    @BoardFromRequest() board: Board,
    @Body() createCardDto: CreateCardDto,
  ): Promise<Card> {
    return this.boardService.createCard(board, createCardDto);
  }
  @Put(':uniqueHashedId/cards/position')
  @UseGuards(BoardExistsGuard)
  async updateCardPosition(
    @BoardFromRequest() board: Board,
    @Body() updatePositionDto: UpdateCardPositionDto,
  ): Promise<Card> {
    return this.boardService.updateCardPosition(board, updatePositionDto);
  }

  @Put('cards/:cardId')
  async updateCard(
    @Param('cardId') cardId: string,
    @Body() updateCardDto: UpdateCardDto,
  ): Promise<Card> {
    return this.boardService.updateCard(cardId, updateCardDto);
  }

  @Delete('cards/:cardId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCard(@Param('cardId') cardId: string): Promise<void> {
    await this.boardService.deleteCard(cardId);
  }
}
