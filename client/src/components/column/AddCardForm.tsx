import React from 'react';
import type { ColumnStatus } from '../../entities/board.entity';
import { useCreateCardForm } from '../../hooks/useCreateCardForm';

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
		setColumn,
	} = useCreateCardForm({
		uniqueHashedId: boardId,
		onSuccess: () => console.log('Card created!'),
	});

	React.useEffect(() => {
		setColumn(columnStatus);
	}, []);

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
				placeholder='Заголовок картки'
				required
			/>
			<textarea
				name='description'
				value={formData.description}
				onChange={handleInputChange}
				className='w-full p-2 mb-2 border rounded text-sm resize-none'
				placeholder='Опис'
				rows={3}
				required
			/>

			<div className='flex justify-between items-center'>
				<button
					type='submit'
					className={`
                        px-3 py-1 rounded text-white text-sm font-semibold 
                        ${
													isLoading
														? 'bg-gray-400'
														: 'bg-indigo-600 hover:bg-indigo-700'
												}
                        transition
                    `}
					disabled={isLoading}
				>
					{isLoading ? 'Створення...' : 'Додати картку'}
				</button>
				<button
					type='button'
					onClick={() => setIsFormVisible(false)}
					className='text-gray-500 text-sm hover:text-gray-700'
				>
					Скасувати
				</button>
			</div>
		</form>
	);

	return (
		<div className='mt-4'>
			{isFormVisible ? (
				renderForm
			) : (
				<button
					onClick={() => setIsFormVisible(true)}
					className='w-full p-2 rounded-lg text-sm font-medium text-gray-500 bg-gray-200 hover:bg-gray-300 transition'
				>
					+ Додати нову картку
				</button>
			)}
		</div>
	);
};

export default AddCardForm;
