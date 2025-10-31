import { Draggable } from '@hello-pangea/dnd';
import React, { useCallback, useState } from 'react';
import { useDeleteCardMutation } from '../../api/boardApi';
import type { Card } from '../../types/entities/board.entity';
import CardEditForm from './CardEditForm';
import CardViewContent from './CardViewContent';

interface CardItemProps {
	card: Card;
	index: number;
	boardId: string;
}

const CardItem: React.FC<CardItemProps> = ({ card, index, boardId }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [deleteCard, { isLoading: isDeleting }] = useDeleteCardMutation();

	const handleDelete = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();

			if (
				window.confirm(`Are you sure you want to delete card "${card.title}"?`)
			) {
				deleteCard({ cardId: card.id, uniqueHashedId: boardId })
					.unwrap()
					.catch(err => console.error('Failed to delete card:', err));
			}
		},
		[card, boardId, deleteCard]
	);

	const handleSetIsEditing = useCallback(
		(value: boolean) => {
			setIsEditing(value);
		},
		[setIsEditing]
	);

	return (
		<Draggable draggableId={card.id} index={index}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...(isEditing ? {} : provided.dragHandleProps)}
					className={` p-3 mb-3 rounded-lg shadow-md border ${
						snapshot.isDragging
							? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500'
							: 'bg-white border-gray-300 hover:shadow-lg'
					} transition-all duration-300 ease-in-out cursor-pointer group ${
						isEditing ? 'pointer-events-auto' : ''
					}`}
					{...(isEditing ? { 'data-is-editing': true } : {})}
				>
					{isEditing ? (
						<CardEditForm
							card={card}
							setIsEditing={handleSetIsEditing}
							boardId={boardId}
						/>
					) : (
						<CardViewContent
							card={card}
							isDeleting={isDeleting}
							setIsEditing={handleSetIsEditing}
							handleDelete={handleDelete}
						/>
					)}
				</div>
			)}
		</Draggable>
	);
};

export default React.memo(CardItem);
