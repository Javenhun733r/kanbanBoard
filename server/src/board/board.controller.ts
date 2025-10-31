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
} from '@nestjs/common';

import { BoardService } from '@app/board/board.service';
import { BoardMapper } from '@app/board/mappers/board.mapper';
import {
  BoardDto,
  CreateCardDto,
  UpdateCardDto,
  UpdateCardPositionDto,
} from '@app/dto/index.dto';
import { BoardResponseDto } from '@app/dto/response.dto';
import { Card } from '@app/entities/board.entity';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  @Get()
  async getAllBoardsUniqueHashId(): Promise<string[]> {
    return this.boardService.getAllBoardsUniqueHashId();
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBoard(@Body() data: BoardDto): Promise<BoardResponseDto> {
    const boardEntity = await this.boardService.createBoard(data);
    return BoardMapper.toBoardResponseDto({ ...boardEntity, cards: [] });
  }

  @Get(':uniqueHashedId')
  async getBoard(
    @Param('uniqueHashedId') uniqueHashedId: string,
  ): Promise<BoardResponseDto> {
    const boardWithCards =
      await this.boardService.getBoardWithCards(uniqueHashedId);

    return BoardMapper.toBoardResponseDto(boardWithCards);
  }

  @Put(':uniqueHashedId')
  async updateBoard(
    @Param('uniqueHashedId') uniqueHashedId: string,
    @Body() updateBoardDto: BoardDto,
  ): Promise<BoardResponseDto> {
    const updatedBoard = await this.boardService.updateBoard(
      uniqueHashedId,
      updateBoardDto,
    );
    return BoardMapper.toBoardResponseDto({ ...updatedBoard, cards: [] });
  }

  @Delete(':uniqueHashedId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBoard(
    @Param('uniqueHashedId') uniqueHashedId: string,
  ): Promise<void> {
    await this.boardService.deleteBoard(uniqueHashedId);
  }

  @Post(':uniqueHashedId/cards')
  @HttpCode(HttpStatus.CREATED)
  async createCard(
    @Param('uniqueHashedId') uniqueHashedId: string,
    @Body() createCardDto: CreateCardDto,
  ): Promise<Card> {
    return this.boardService.createCard(uniqueHashedId, createCardDto);
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
  @Put(':uniqueHashedId/cards/position')
  async updateCardPosition(
    @Param('uniqueHashedId') uniqueHashedId: string,
    @Body() updatePositionDto: UpdateCardPositionDto,
  ): Promise<Card> {
    return this.boardService.updateCardPosition(
      uniqueHashedId,
      updatePositionDto,
    );
  }
}
