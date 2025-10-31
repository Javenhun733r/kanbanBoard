import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useUpdateCardMutation } from '../../api/boardApi';
import type { Card } from '../../types/entities/board.entity';
import Button from '../ui/button/Button';

interface CardEditFormProps {
	card: Card;
	boardId: string;
	setIsEditing: (isEditing: boolean) => void;
}

const CardEditForm: React.FC<CardEditFormProps> = ({
	boardId,
	card,
	setIsEditing,
}) => {
	const [title, setTitle] = useState(card.title);
	const [description, setDescription] = useState(card.description || '');

	const [updateCard, { isLoading }] = useUpdateCardMutation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim()) {
			toast.error('Title cannot be empty.');
			return;
		}

		try {
			await updateCard({
				cardId: card.id,
				uniqueHashedId: boardId,
				payload: {
					title: title.trim(),
					description: description.trim(),
				},
			}).unwrap();
			setIsEditing(false);
			toast.success('Card updated successfully!');
		} catch (error) {
			console.error('Failed to update card:', error);
			toast.error('Failed to save changes.');
		}
	};

	return (
		<form onSubmit={handleSubmit} className='p-3'>
			<input
				name='title'
				value={title}
				onChange={e => setTitle(e.target.value)}
				className='w-full p-2 mb-2 border rounded text-sm font-semibold'
				placeholder='Card title'
				required
			/>
			<textarea
				name='description'
				value={description}
				onChange={e => setDescription(e.target.value)}
				className='w-full border rounded p-1 mb-2 text-sm'
				rows={3}
				placeholder='Description'
			/>
			<div className='flex justify-end items-center mt-2'>
				<Button
					type='submit'
					variant='primary'
					isLoading={isLoading}
					disabled={isLoading}
					className='mr-2'
				>
					{isLoading ? 'Saving...' : 'Save'}
				</Button>
				<Button
					type='button'
					variant='ghost'
					onClick={() => setIsEditing(false)}
				>
					Cancel
				</Button>
			</div>
		</form>
	);
};

export default CardEditForm;
