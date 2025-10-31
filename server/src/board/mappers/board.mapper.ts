import { Board, Card } from '@prisma/client';
import { BoardResponseDto, CardResponseDto } from '@app/dto/response.dto';

export class BoardMapper {
  private static groupCards(cards: Card[]): BoardResponseDto['columns'] {
    const grouped = {
      ToDo: [] as CardResponseDto[],
      InProgress: [] as CardResponseDto[],
      Done: [] as CardResponseDto[],
    };

    for (const card of cards) {
      const cardDto: CardResponseDto = {
        id: card.id,
        title: card.title,
        description: card.description,
        column: card.column,
        orderIndex: card.orderIndex,
        updatedAt: card.updatedAt,
      };
      grouped[card.column as keyof typeof grouped].push(cardDto);
    }
    return grouped;
  }
  static toBoardResponseDto(
    board: Board & { cards: Card[] },
  ): BoardResponseDto {
    return {
      uniqueHashedId: board.uniqueHashedId,
      name: board.name,
      columns: BoardMapper.groupCards(board.cards),
    };
  }
}
