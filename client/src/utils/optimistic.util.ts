import type { BoardResponseDto } from '../types/dto/board-response.dto';
import type { ColumnStatus } from '../types/entities/board.entity';

export const reorderCardsOptimistically = (
	draft: BoardResponseDto,
	source: { droppableId: string; index: number },
	destination: { droppableId: string; index: number },
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_draggableId: string
): void => {
	const startColumnKey = source.droppableId as keyof typeof draft.columns;
	const finishColumnKey = destination.droppableId as keyof typeof draft.columns;

	const startCards = draft.columns[startColumnKey];
	const finishCards = draft.columns[finishColumnKey];

	const [movedCard] = startCards.splice(source.index, 1);

	if (!movedCard) return;

	if (startColumnKey === finishColumnKey) {
		finishCards.splice(destination.index, 0, movedCard);
	} else {
		movedCard.column = finishColumnKey as ColumnStatus;
		finishCards.splice(destination.index, 0, movedCard);
	}
};
