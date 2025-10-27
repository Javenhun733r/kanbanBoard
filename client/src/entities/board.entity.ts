export type ColumnStatus = 'ToDo' | 'InProgress' | 'Done';

export interface CardEntity {
	id: string;
	boardId: string;
	title: string;
	description: string;
	column: ColumnStatus;
	orderIndex: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface BoardEntity {
	id: string;
	uniqueHashedId: string;
	name: string;
	cards?: CardEntity[];
	createdAt: Date;
	updatedAt: Date;
}

export type Board = BoardEntity;
export type Card = CardEntity;
