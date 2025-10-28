import { ColumnStatus } from '@prisma/client';

export class CardResponseDto {
  id: string;
  title: string;
  description: string;
  column: ColumnStatus;
  orderIndex: number;
  updatedAt: Date;
}

export class BoardResponseDto {
  uniqueHashedId: string;
  name: string;
  columns: {
    ToDo: CardResponseDto[];
    InProgress: CardResponseDto[];
    Done: CardResponseDto[];
  };
}
