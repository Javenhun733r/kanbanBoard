import type { DropResult } from '@hello-pangea/dnd';
import { DragDropContext } from '@hello-pangea/dnd';
import React from 'react';
import { boardsApi, useUpdateCardPositionMutation } from '../../api/boardApi';
import type { BoardResponseDto } from '../../dto/board-response.dto';
import type { ColumnStatus } from '../../entities/board.entity';
import { store } from '../../store/store'; // Для доступу до Redux store
import Column from '../column/Column';

interface BoardProps {
	boardData: BoardResponseDto;
}

// 1. ФУНКЦІЯ ДЛЯ ОПТИМІСТИЧНОГО ОНОВЛЕННЯ (МИТТЄВЕ UI-ПЕРЕМІЩЕННЯ)
// Ця функція оновлює кеш RTK Query, змушуючи React перерендерити компоненти.
const reorderCardsOptimistically = (
	draft: BoardResponseDto,
	source: { droppableId: string; index: number },
	destination: { droppableId: string; index: number },
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_draggableId: string
) => {
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

const Board: React.FC<BoardProps> = ({ boardData }) => {
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
			boardsApi.util.updateQueryData(
				'getBoard',
				boardData.uniqueHashedId,
				draft => {
					reorderCardsOptimistically(draft, source, destination, draggableId);
				}
			)
		);

		const payload = {
			cardId: draggableId,
			newColumn: finishColumnId as ColumnStatus,
			newOrderIndex: newOrderIndex,
		};

		updateCardPosition({
			uniqueHashedId: boardData.uniqueHashedId,
			payload,
		})
			.unwrap() 
			.catch(() => {
		
				store.dispatch(
					boardsApi.util.invalidateTags([
						{ type: 'Board', id: boardData.uniqueHashedId },
					])
				);
				alert('Помилка при збереженні змін на сервері. Статус відкочено.');
			});
	};

	const columns = boardData.columns;
	const boardId = boardData.uniqueHashedId;

	return (
		<div className='p-6 bg-gray-50 min-h-screen'>
			<header className='mb-8 border-b pb-4 flex items-center justify-start'>
				<h1 className='text-2xl font-bold text-gray-700 mr-5'>
					{boardData.name}
				</h1>
				<p className='text-sm text-yellow-600 mt-1'>
					⭐️ {boardData.uniqueHashedId}
				</p>
			</header>
			<DragDropContext onDragEnd={onDragEnd}>
				<div className='flex space-x-6 overflow-x-auto'>
					<Column
						title='ToDo'
						cards={columns.ToDo}
						droppableId='ToDo'
						boardId={boardId}
					/>
					<Column
						title='In Progress'
						cards={columns.InProgress}
						droppableId='InProgress'
						boardId={boardId}
					/>
					<Column
						title='Done'
						cards={columns.Done}
						droppableId='Done'
						boardId={boardId}
					/>
				</div>
			</DragDropContext>
		</div>
	);
};

export default Board;
