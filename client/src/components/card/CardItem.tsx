import { useDeleteCardMutation } from '@api/boardApi';
import type { Card } from '@appTypes/entities/board.entity';
import { Draggable, type DraggableStateSnapshot } from '@hello-pangea/dnd';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import CardEditForm from './CardEditForm';
import CardViewContent from './CardViewContent';
interface CardItemProps {
	card: Card;
	index: number;
	boardId: string;
	isCardSaving: boolean;
}
const CardItem: React.FC<CardItemProps> = ({
	card,
	index,
	boardId,
	isCardSaving,
}) => {
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
	const getCardClasses = (
		snapshot: DraggableStateSnapshot,
		isEditing: boolean,
		isSaving: boolean
	) => {
		return clsx(
			'p-3 mb-3 rounded-lg shadow-md border transition-all duration-75 ease-in-out cursor-pointer group',

			{ 'pointer-events-auto': isEditing },

			{
				'border-blue-500 ring-2 ring-blue-500': snapshot.isDragging,

				'bg-gray-200 border-gray-400': isSaving && !snapshot.isDragging,

				'bg-white border-gray-300 hover:shadow-lg':
					!isSaving && !snapshot.isDragging,
			}
		);
	};

	const isDragDisabled = isEditing || isDeleting || isCardSaving;
	return (
		<Draggable
			draggableId={card.id}
			index={index}
			isDragDisabled={isDragDisabled}
		>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...(!isEditing && provided.dragHandleProps)}
					className={getCardClasses(snapshot, isEditing, isCardSaving)}
					{...(isEditing && { 'data-is-editing': true })}
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
