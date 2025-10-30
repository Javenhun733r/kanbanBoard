import React from 'react';
import { useCreateCardForm } from '../../hooks/useCreateCardForm';
import type { ColumnStatus } from '../../types/entities/board.entity';
import Button from '../ui/button/Button';

interface AddCardFormProps {
	boardId: string;
	columnStatus: ColumnStatus;
}

const AddCardForm: React.FC<AddCardFormProps> = ({ boardId, columnStatus }) => {
	const {
		formData,
		isFormVisible,
		isLoading,
		setIsFormVisible,
		handleInputChange,
		handleSubmit,
	} = useCreateCardForm({
		uniqueHashedId: boardId,
		onSuccess: () => console.log('Card created!'),
		initialColumn: columnStatus,
	});

	const renderForm = (
		<form
			onSubmit={handleSubmit}
			className='p-3 bg-white rounded-lg shadow-inner mb-4'
		>
			<input
				name='title'
				value={formData.title}
				onChange={handleInputChange}
				className='w-full p-2 mb-2 border rounded text-sm'
				placeholder='Card header'
				required
			/>
			<textarea
				name='description'
				value={formData.description}
				onChange={handleInputChange}
				className='w-full p-2 mb-2 border rounded text-sm resize-none'
				placeholder='Description'
				rows={3}
				required
			/>

			<div className='flex justify-between items-center'>
				<Button type='submit' variant='submit' isLoading={isLoading}>
					{isLoading ? 'Creating...' : 'Add card'}
				</Button>

				<Button
					type='button'
					variant='ghost'
					onClick={() => setIsFormVisible(false)}
					className='px-0! py-0! text-sm! font-normal!'
				>
					Cancel
				</Button>
			</div>
		</form>
	);

	return (
		<div className='mt-4'>
			{isFormVisible ? (
				renderForm
			) : (
				<Button
					onClick={() => setIsFormVisible(true)}
					variant='secondary'
					className='w-full p-2'
				>
					+ Add new card
				</Button>
			)}
		</div>
	);
};

export default AddCardForm;
