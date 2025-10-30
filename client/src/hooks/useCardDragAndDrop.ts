import type { DropResult } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { boardsApi, useUpdateCardPositionMutation } from '../api/boardApi';
import { store } from '../store/store';
import type { ColumnStatus } from '../types/entities/board.entity';
import { reorderCardsOptimistically } from '../utils/optimistic.util';

export const useCardDragAndDrop = (boardId: string) => {
	const [updateCardPosition] = useUpdateCardPositionMutation();

	const onDragEnd = (result: DropResult) => {
		const { destination, source, draggableId } = result;

		if (
			!destination ||
			(destination.droppableId === source.droppableId &&
				destination.index === source.index)
		) {
			return;
		}

		const finishColumnId = destination.droppableId;
		const newOrderIndex = destination.index;

		store.dispatch(
			boardsApi.util.updateQueryData('getBoard', boardId, draft => {
				reorderCardsOptimistically(draft, source, destination, draggableId);
			})
		);

		const payload = {
			cardId: draggableId,
			newColumn: finishColumnId as ColumnStatus,
			newOrderIndex: newOrderIndex,
		};

		updateCardPosition({
			uniqueHashedId: boardId,
			payload,
		})
			.unwrap()
			.catch(() => {
				store.dispatch(
					boardsApi.util.invalidateTags([{ type: 'Board', id: boardId }])
				);
				toast.error('Error saving changes to the server. Status rolled back.');
			});
	};

	return { onDragEnd };
};
