import { Droppable } from '@hello-pangea/dnd';
import React from 'react';
import type { Card, ColumnStatus } from '../../types/entities/board.entity';
import CardItem from '../card/CardItem';
import AddCardForm from './AddCardForm';

interface ColumnProps {
	title: string;
	cards: Card[];
	droppableId: string;
	boardId: string;
}

const Column: React.FC<ColumnProps> = ({
	title,
	cards,
	droppableId,
	boardId,
}) => {
	return (
		<Droppable droppableId={droppableId}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.droppableProps}
					className={`
            min-w-2xs p-4 rounded-lg shrink-0 min-h-[600px]
            ${
							snapshot.isDraggingOver
								? 'bg-indigo-50 border-indigo-400'
								: 'bg-gray-100 border-gray-300'
						} 
            border-2 transition-all duration-500
          `}
				>
					<h3 className='font-bold text-lg mb-4 text-gray-800 border-b-2 pb-2 text-center'>
						{title} ({cards.length})
					</h3>

					<div>
						{cards.map((card, index) => (
							<CardItem
								key={card.id}
								card={card}
								index={index}
								boardId={boardId}
							/>
						))}
						{provided.placeholder}
					</div>

					<AddCardForm
						boardId={boardId}
						columnStatus={droppableId as ColumnStatus}
					/>
				</div>
			)}
		</Droppable>
	);
};

export default React.memo(Column);
