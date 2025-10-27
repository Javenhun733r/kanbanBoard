import { Draggable } from '@hello-pangea/dnd';
import React from 'react';
import type { Card } from '../../entities/board.entity';

interface CardItemProps {
	card: Card;
	index: number;
}

const CardItem: React.FC<CardItemProps> = ({ card, index }) => {
	return (
		<Draggable draggableId={card.id} index={index}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={`
            p-3 mb-3 rounded-lg shadow-md border 
            ${
							snapshot.isDragging
								? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500'
								: 'bg-white border-gray-300 hover:shadow-lg'
						}
            transition duration-200 cursor-pointer
          `}
				>
					<h4 className='font-semibold text-gray-900 text-sm'>{card.title}</h4>
					<div className='text-xs text-gray-500'>
						<p>#{card.id.substring(0, 5)} opened 3 days ago</p>
						<p className='mt-1'>
							<span className='font-medium text-gray-600'>Admin</span>
							{' | '}
							<span className='text-gray-600'>Comments: 3</span>
						</p>
					</div>
				</div>
			)}
		</Draggable>
	);
};

export default CardItem;
