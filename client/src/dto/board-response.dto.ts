import type { ColumnStatus } from '../entities/board.entity';

export interface CardResponseDto {
	id: string;
	boardId: string;
	createdAt: Date;
	updatedAt: Date;
	title: string;
	description: string;
	column: ColumnStatus;
	orderIndex: number;
}

export interface BoardResponseDto {
	uniqueHashedId: string;
	name: string;
	columns: {
		ToDo: CardResponseDto[];
		InProgress: CardResponseDto[];
		Done: CardResponseDto[];
	};
}
