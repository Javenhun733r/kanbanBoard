import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundError, UniqueConstraintError } from '../common/error';
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
const mockBoardFound: Board & { cards: [] } = {
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
  column: ColumnStatus.ToDo,
  orderIndex: 0,
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
  });

  it('should successfully create a board', async () => {
    const mockBoard: Board = {
      id: 'uuid-1',
      uniqueHashedId: 'TEST-001',
      name: 'Test Board',
      createdAt: new Date(),
      updatedAt: new Date(),
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
  it('should throw NotFoundException if board not found', async () => {
    mockBoardRepository.findByUniqueId.mockResolvedValue(null);

    await expect(service.getBoardWithCards('NON-EXIST')).rejects.toThrow(
      NotFoundException,
    );
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
    mockBoardRepository.findByUniqueId.mockResolvedValue(mockBoardFound);
    mockBoardRepository.deleteBoard.mockResolvedValue(undefined);

    await expect(service.deleteBoard('TEST-001')).resolves.toBeUndefined();
    expect(mockBoardRepository.deleteBoard).toHaveBeenCalledWith('uuid-1');
  });

  it('should throw NotFoundException on delete if board not found', async () => {
    mockBoardRepository.findByUniqueId.mockResolvedValue(null);

    await expect(service.deleteBoard('NON-EXIST')).rejects.toThrow(
      NotFoundException,
    );
    expect(mockBoardRepository.deleteBoard).not.toHaveBeenCalled();
  });
  it('should successfully create a card', async () => {
    mockBoardRepository.findByUniqueId.mockResolvedValue(mockBoardFound);
    mockCardRepository.createCard.mockResolvedValue(mockCardFound);

    const result = await service.createCard('TEST-001', {
      title: 'New Task',
      description: 'Desc',
      column: 'ToDo',
    });

    expect(result.id).toEqual('card-1');
    expect(mockCardRepository.createCard).toHaveBeenCalledWith(
      'uuid-1',
      expect.anything(),
    );
  });

  it('should throw NotFoundException on createCard if board not found', async () => {
    mockBoardRepository.findByUniqueId.mockResolvedValue(null);

    await expect(
      service.createCard('NON-EXIST', {
        title: 'Task',
        description: 'Desc',
        column: 'ToDo',
      }),
    ).rejects.toThrow(NotFoundException);
    expect(mockCardRepository.createCard).not.toHaveBeenCalled();
  });
  it('should successfully update card position', async () => {
    mockBoardRepository.findByUniqueId.mockResolvedValue(mockBoardFound);
    mockCardRepository.findCardById.mockResolvedValue(mockCardFound);
    mockCardRepository.updateCardPosition.mockResolvedValue({
      ...mockCardFound,
      column: ColumnStatus.InProgress,
      orderIndex: 5,
    });

    const dto = {
      cardId: 'card-1',
      newColumn: ColumnStatus.InProgress,
      newOrderIndex: 5,
    };

    const result = await service.updateCardPosition('TEST-001', dto);

    expect(result.column).toEqual('InProgress');
    expect(mockCardRepository.updateCardPosition).toHaveBeenCalled();
  });

  it('should throw NotFoundException on updateCardPosition if card is not on board', async () => {
    mockBoardRepository.findByUniqueId.mockResolvedValue(mockBoardFound);
    mockCardRepository.findCardById.mockResolvedValue({
      ...mockCardFound,
      boardId: 'another-uuid',
    });

    const dto = {
      cardId: 'card-1',
      newColumn: ColumnStatus.InProgress,
      newOrderIndex: 5,
    };

    await expect(service.updateCardPosition('TEST-001', dto)).rejects.toThrow(
      NotFoundException,
    );
  });
});
