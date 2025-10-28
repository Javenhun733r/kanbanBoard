import { DragDropContext } from '@hello-pangea/dnd';
import React from 'react';
import type { BoardResponseDto } from '../../dto/board-response.dto';
import { useCardDragAndDrop } from '../../hooks/useCardDragAndDrop';
import Column from '../column/Column';

interface BoardProps {
	boardData: BoardResponseDto;
}

const Board: React.FC<BoardProps> = ({ boardData }) => {
	const columns = boardData.columns;
	const boardId = boardData.uniqueHashedId;

	const { onDragEnd } = useCardDragAndDrop(boardId);

	return (
		<div className='p-6 bg-gray-50 min-h-screen'>
			<DragDropContext onDragEnd={onDragEnd}>
				<div className='flex space-x-6 overflow-x-auto min-w-full'>
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
