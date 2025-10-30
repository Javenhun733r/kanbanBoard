import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundError, UniqueConstraintError } from '../common/errors/error';
import { UpdateCardPositionDto } from '../dto/index.dto';
import { Board, Card, ColumnStatus } from '../entities/board.entity';
import { BoardService } from './board.service';
import { BoardRepository } from './repository/board.repository';
import { CardRepository } from './repository/card.repository';

const mockBoardRepository = {
  createBoard: jest.fn(),
  findByUniqueId: jest.fn(),
  deleteBoard: jest.fn(),
  updateBoard: jest.fn(),
} as unknown as jest.Mocked<BoardRepository>;

const mockCardRepository = {
  createCard: jest.fn(),
  updateCardPosition: jest.fn(),
  findCardById: jest.fn(),
  updateCard: jest.fn(),
  deleteCard: jest.fn(),
} as unknown as jest.Mocked<CardRepository>;

const mockBoardFound: Board & { cards: Card[] } = {
  id: 'uuid-1',
  uniqueHashedId: 'TEST-001',
  name: 'Test Board',
  createdAt: new Date(),
  updatedAt: new Date(),
  cards: [],
};

const mockCardFound = {
  id: 'card-1',
  boardId: 'uuid-1',
  title: 'Test Card',
  description: '',
  column: ColumnStatus.ToDo,
  orderIndex: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
} as Card;

describe('BoardsService', () => {
  let service: BoardService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        { provide: BoardRepository, useValue: mockBoardRepository },
        { provide: CardRepository, useValue: mockCardRepository },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
    mockBoardRepository.findByUniqueId.mockResolvedValue(mockBoardFound);
  });

  it('should successfully create a board', async () => {
    const mockBoard: Board & { cards: Card[] } = {
      id: 'uuid-1',
      uniqueHashedId: 'TEST-001',
      name: 'Test Board',
      createdAt: new Date(),
      updatedAt: new Date(),
      cards: [],
    };

    mockBoardRepository.createBoard.mockResolvedValue(mockBoard);

    const result = await service.createBoard({
      name: 'Test Board',
      uniqueHashedId: 'TEST-001',
    });
    expect(result.name).toEqual('Test Board');
  });

  it('should throw UniqueConstraintError', async () => {
    mockBoardRepository.createBoard.mockRejectedValue(
      new UniqueConstraintError('Board already exists'),
    );

    await expect(
      service.createBoard({ name: 'Test', uniqueHashedId: 'EXIST' }),
    ).rejects.toThrow(UniqueConstraintError);
  });

  it('should successfully update board name', async () => {
    const updatedBoard = { ...mockBoardFound, name: 'New Name' };
    mockBoardRepository.updateBoard.mockResolvedValue(updatedBoard);

    const result = await service.updateBoard('TEST-001', { name: 'New Name' });

    expect(result.name).toEqual('New Name');
    expect(mockBoardRepository.updateBoard).toHaveBeenCalledWith('TEST-001', {
      name: 'New Name',
    });
  });

  it('should throw NotFoundException when updating non-existent board', async () => {
    mockBoardRepository.updateBoard.mockRejectedValue(
      new NotFoundError('Board not found'),
    );

    const updateDto = { name: 'New Name' };

    await expect(service.updateBoard('NON-EXIST', updateDto)).rejects.toThrow(
      NotFoundError,
    );
    expect(mockBoardRepository.updateBoard).toHaveBeenCalledWith(
      'NON-EXIST',
      updateDto,
    );
  });

  it('should successfully delete a board', async () => {
    mockBoardRepository.deleteBoard.mockResolvedValue(undefined);

    await expect(
      service.deleteBoard(mockBoardFound.uniqueHashedId),
    ).resolves.toBeUndefined();

    expect(mockBoardRepository.findByUniqueId).toHaveBeenCalledWith(
      mockBoardFound.uniqueHashedId,
    );
    expect(mockBoardRepository.deleteBoard).toHaveBeenCalledWith('uuid-1');
  });

  it('should successfully create a card', async () => {
    mockCardRepository.createCard.mockResolvedValue(mockCardFound);

    const createCardDto = {
      title: 'New Task',
      description: 'Desc',
      column: ColumnStatus.ToDo,
    };

    const result = await service.createCard(
      mockBoardFound.uniqueHashedId,
      createCardDto,
    );

    expect(result.id).toEqual('card-1');
    expect(mockBoardRepository.findByUniqueId).toHaveBeenCalledWith(
      mockBoardFound.uniqueHashedId,
    );
    expect(mockCardRepository.createCard).toHaveBeenCalledWith(
      'uuid-1',
      createCardDto,
    );
  });
  it('should successfully update card position', async () => {
    mockCardRepository.updateCardPosition.mockResolvedValue({
      ...mockCardFound,
      column: ColumnStatus.InProgress,
      orderIndex: 5,
    } as Card);

    const dto: UpdateCardPositionDto = {
      cardId: 'card-1',
      newColumn: ColumnStatus.InProgress,
      newOrderIndex: 5,
    };
    const result = await service.updateCardPosition(
      mockBoardFound.uniqueHashedId,
      dto,
    );

    expect(result.column).toEqual(ColumnStatus.InProgress);

    expect(mockBoardRepository.findByUniqueId).toHaveBeenCalledWith(
      mockBoardFound.uniqueHashedId,
    );

    expect(mockCardRepository.updateCardPosition).toHaveBeenCalledWith(
      dto,
      mockBoardFound.id,
    );

    expect(mockCardRepository.findCardById).not.toHaveBeenCalled();
  });
});
