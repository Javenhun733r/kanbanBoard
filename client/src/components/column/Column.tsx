import type { Card, ColumnStatus } from '@appTypes/entities/board.entity';
import CardItem from '@components/card/CardItem';
import { Droppable } from '@hello-pangea/dnd';
import React from 'react';
import AddCardForm from './AddCardForm';

interface ColumnProps {
	title: string;
	cards: Card[];
	droppableId: string;
	boardId: string;
	isCardSaving: boolean;
}

const Column: React.FC<ColumnProps> = ({
	title,
	cards,
	droppableId,
	boardId,
	isCardSaving,
}) => {
	return (
		<Droppable droppableId={droppableId} isDropDisabled={isCardSaving}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.droppableProps}
					className={`
             p-4 rounded-lg shrink-0 min-h-[600px] w-[30%]
            ${
							snapshot.isDraggingOver
								? 'bg-indigo-50 border-indigo-400'
								: 'bg-gray-100 border-gray-300'
						} 
            border-2 duration-100 transition-all
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
								isCardSaving={isCardSaving}
							/>
						))}
						{provided.placeholder}
					</div>

					<AddCardForm
						boardId={boardId}
						columnStatus={droppableId as ColumnStatus}
						isCardSaving={isCardSaving}
					/>
				</div>
			)}
		</Droppable>
	);
};

export default React.memo(Column);
