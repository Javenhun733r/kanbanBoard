import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCardPositionDto } from '@app/dto/index.dto';
import { BoardResponseDto } from '@app/dto/response.dto';
import { Board, Card, ColumnStatus } from '@app/entities/board.entity';
import { BoardController } from '@app/board/board.controller';
import { BoardService } from '@app/board/board.service';
import { BoardMapper } from '@app/board/mappers/board.mapper';
import { BoardRepository } from '@app/board/repository/board.repository';

const MOCK_BOARD_HASH_ID = 'TEST-001';
const MOCK_CARD_ID = 'CARD-UUID-123';

const mockBoardService = {
  createBoard: jest
    .fn()
    .mockResolvedValue({ uniqueHashedId: 'MOCK-001', name: 'Mock Board' }),
  getBoardWithCards: jest.fn(),
  updateBoard: jest.fn(),
  deleteBoard: jest.fn(),
  createCard: jest.fn(),
  updateCard: jest.fn(),
  updateCardPosition: jest.fn(),
  deleteCard: jest.fn(),
};

const mockBoardRepository = {} as unknown as jest.Mocked<BoardRepository>;

describe('BoardController', () => {
  let controller: BoardController;
  let service: jest.Mocked<BoardService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [
        { provide: BoardService, useValue: mockBoardService },
        { provide: BoardRepository, useValue: mockBoardRepository },
      ],
    }).compile();

    controller = module.get<BoardController>(BoardController);
    service = module.get(BoardService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call boardService.createBoard on POST request and map the result', async () => {
    const createDto = { name: 'New Test Board', uniqueHashedId: 'TEST-NEW' };

    const createdEntity = {
      id: 'uuid-2',
      ...createDto,
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Board & { cards: Card[] };
    const expectedDto: BoardResponseDto = {
      uniqueHashedId: createdEntity.uniqueHashedId,
      name: createdEntity.name,
      columns: { ToDo: [], InProgress: [], Done: [] },
    };

    service.createBoard.mockResolvedValue(createdEntity);
    jest.spyOn(BoardMapper, 'toBoardResponseDto').mockReturnValue(expectedDto);

    const result = await controller.createBoard(createDto);

    expect(service.createBoard).toHaveBeenCalledWith(createDto);
    expect(result).toEqual(expectedDto);
  });

  it('should call boardService.getBoardWithCards using Param ID and map the result', async () => {
    const boardEntity: Board & { cards: Card[] } = {
      id: 'uuid-1',
      uniqueHashedId: MOCK_BOARD_HASH_ID,
      name: 'Test',
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const expectedDto: BoardResponseDto = {
      uniqueHashedId: MOCK_BOARD_HASH_ID,
      name: 'Test',
      columns: { ToDo: [], InProgress: [], Done: [] },
    };

    service.getBoardWithCards.mockResolvedValue(boardEntity);
    jest.spyOn(BoardMapper, 'toBoardResponseDto').mockReturnValue(expectedDto);

    const result = await controller.getBoard(MOCK_BOARD_HASH_ID);

    expect(service.getBoardWithCards).toHaveBeenCalledWith(MOCK_BOARD_HASH_ID);
    expect(result).toEqual(expectedDto);
  });

  it('should call boardService.updateBoard using Param ID and Body DTO', async () => {
    const updateDto = { name: 'Updated Name' };
    const updatedEntity = {
      id: 'uuid-1',
      uniqueHashedId: MOCK_BOARD_HASH_ID,
      name: updateDto.name,
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Board & { cards: Card[] };
    const expectedDto: BoardResponseDto = {
      uniqueHashedId: MOCK_BOARD_HASH_ID,
      name: updateDto.name,
      columns: { ToDo: [], InProgress: [], Done: [] },
    };

    service.updateBoard.mockResolvedValue(updatedEntity);
    jest.spyOn(BoardMapper, 'toBoardResponseDto').mockReturnValue(expectedDto);

    const result = await controller.updateBoard(MOCK_BOARD_HASH_ID, updateDto);

    expect(service.updateBoard).toHaveBeenCalledWith(
      MOCK_BOARD_HASH_ID,
      updateDto,
    );
    expect(result).toEqual(expectedDto);
  });

  it('should call boardService.deleteBoard using Param ID', async () => {
    service.deleteBoard.mockResolvedValue(undefined);

    await controller.deleteBoard(MOCK_BOARD_HASH_ID);

    expect(service.deleteBoard).toHaveBeenCalledWith(MOCK_BOARD_HASH_ID);
  });

  it('should call boardService.createCard with board ID and card DTO', async () => {
    const createCardDto = {
      title: 'New Card',
      column: ColumnStatus.ToDo,
      orderIndex: 0,
    };
    const createdCard: Card = {
      id: MOCK_CARD_ID,
      boardId: MOCK_BOARD_HASH_ID,
      ...createCardDto,
      description: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Card;

    service.createCard.mockResolvedValue(createdCard);

    const result = await controller.createCard(
      MOCK_BOARD_HASH_ID,
      createCardDto,
    );

    expect(service.createCard).toHaveBeenCalledWith(
      MOCK_BOARD_HASH_ID,
      createCardDto,
    );
    expect(result).toEqual(createdCard);
  });

  it('should call boardService.updateCardPosition with board ID and position DTO', async () => {
    const updatePositionDto: UpdateCardPositionDto = {
      cardId: MOCK_CARD_ID,
      newColumn: ColumnStatus.InProgress,
      newOrderIndex: 0,
    };
    const updatedCard: Card = {
      id: MOCK_CARD_ID,
      boardId: MOCK_BOARD_HASH_ID,
      title: 'Move Card',
      description: '',
      column: ColumnStatus.InProgress,
      orderIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Card;

    service.updateCardPosition.mockResolvedValue(updatedCard);

    const result = await controller.updateCardPosition(
      MOCK_BOARD_HASH_ID,
      updatePositionDto,
    );

    expect(service.updateCardPosition).toHaveBeenCalledWith(
      MOCK_BOARD_HASH_ID,
      updatePositionDto,
    );
    expect(result).toEqual(updatedCard);
  });

  it('should call boardService.updateCard with card ID and update DTO', async () => {
    const updateCardDto = { title: 'New Title' };
    const updatedCard: Card = {
      id: MOCK_CARD_ID,
      boardId: MOCK_BOARD_HASH_ID,
      title: updateCardDto.title,
      description: '',
      column: ColumnStatus.ToDo,
      orderIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Card;

    service.updateCard.mockResolvedValue(updatedCard);

    const result = await controller.updateCard(MOCK_CARD_ID, updateCardDto);

    expect(service.updateCard).toHaveBeenCalledWith(
      MOCK_CARD_ID,
      updateCardDto,
    );
    expect(result).toEqual(updatedCard);
  });

  it('should call boardService.deleteCard with card ID', async () => {
    service.deleteCard.mockResolvedValue(undefined);

    await controller.deleteCard(MOCK_CARD_ID);

    expect(service.deleteCard).toHaveBeenCalledWith(MOCK_CARD_ID);
  });
});
