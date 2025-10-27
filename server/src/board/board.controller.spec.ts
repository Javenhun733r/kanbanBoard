import { Test, TestingModule } from '@nestjs/testing';
import { BoardResponseDto } from '../dto/response.dto';
import { Board, Card } from '../entities/board.entity';
import { BoardMapper } from '../mappers/board.mapper';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
const mockBoardService = {
  createBoard: jest
    .fn()
    .mockResolvedValue({ uniqueHashedId: 'MOCK-001', name: 'Mock Board' }),
  getBoardWithCards: jest.fn(),
  deleteBoard: jest.fn(),
  createCard: jest.fn(),
  updateCard: jest.fn(),
  updateCardPosition: jest.fn(),
};

describe('BoardController', () => {
  let controller: BoardController;
  let service: jest.Mocked<BoardService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [{ provide: BoardService, useValue: mockBoardService }],
    })

      .compile();

    controller = module.get<BoardController>(BoardController);
    service = module.get(BoardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call boardService.createBoard on POST request', async () => {
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

    mockBoardService.createBoard.mockResolvedValue(createdEntity);

    jest.spyOn(BoardMapper, 'toBoardResponseDto').mockReturnValue(expectedDto);

    const result = await controller.createBoard(createDto);

    expect(service.createBoard).toHaveBeenCalledWith(createDto);
    expect(result).toEqual(expectedDto);

    jest.restoreAllMocks();
  });
  it('should call boardService.getBoardWithCards on GET request and map the result', async () => {
    const boardWithCards = {
      id: 'uuid-1',
      uniqueHashedId: 'TEST-001',
      name: 'Test',
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Board & { cards: Card[] };
    const expectedDto: BoardResponseDto = {
      uniqueHashedId: 'TEST-001',
      name: 'Test',
      columns: { ToDo: [], InProgress: [], Done: [] },
    };

    service.getBoardWithCards.mockResolvedValue(boardWithCards);
    jest.spyOn(BoardMapper, 'toBoardResponseDto').mockReturnValue(expectedDto);

    const result = await controller.getBoard('TEST-001');

    expect(service.getBoardWithCards).toHaveBeenCalledWith('TEST-001');
    expect(result).toEqual(expectedDto);

    jest.restoreAllMocks();
  });
});
