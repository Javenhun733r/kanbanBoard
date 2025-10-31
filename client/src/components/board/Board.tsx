import type { BoardResponseDto } from '@appTypes/dto/board-response.dto';
import Column from '@components/column/Column';
import { DragDropContext } from '@hello-pangea/dnd';
import { useCardDragAndDrop } from '@hooks/useCardDragAndDrop';
import React, { useMemo } from 'react';

interface BoardProps {
	boardData: BoardResponseDto;
}

const Board: React.FC<BoardProps> = ({ boardData }) => {
	const columns = boardData.columns;
	const boardId = boardData.uniqueHashedId;

	const { onDragEnd } = useCardDragAndDrop(boardId);
	const todoCards = useMemo(() => columns.ToDo, [columns.ToDo]);
	const inProgressCards = useMemo(
		() => columns.InProgress,
		[columns.InProgress]
	);
	const doneCards = useMemo(() => columns.Done, [columns.Done]);
	return (
		<div className='p-6 bg-gray-50 min-h-screen relative'>
			<DragDropContext onDragEnd={onDragEnd}>
				<div className='flex space-x-6 overflow-x-auto min-w-full transition-all duration-100 ease-in-out'>
					<Column
						title='ToDo'
						cards={todoCards}
						droppableId='ToDo'
						boardId={boardId}
					/>
					<Column
						title='In Progress'
						cards={inProgressCards}
						droppableId='InProgress'
						boardId={boardId}
					/>
					<Column
						title='Done'
						cards={doneCards}
						droppableId='Done'
						boardId={boardId}
					/>
				</div>
			</DragDropContext>
		</div>
	);
};

export default React.memo(Board);
