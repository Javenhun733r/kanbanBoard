import { boardsApi, useUpdateCardPositionMutation } from '@api/boardApi';
import type { ColumnStatus } from '@appTypes/entities/board.entity';
import type { DropResult } from '@hello-pangea/dnd';
import { store } from '@store/store';
import { reorderCardsOptimistically } from '@utils/optimistic.util';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useCardDragAndDrop = (boardId: string) => {
	const [updateCardPosition, { isLoading: isCardSaving }] =
		useUpdateCardPositionMutation();

	const onDragEnd = useCallback(
		(result: DropResult) => {
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
					toast.error(
						'Error saving changes to the server. Status rolled back.'
					);
				});
		},
		[boardId, updateCardPosition]
	);

	return { onDragEnd, isCardSaving };
};
