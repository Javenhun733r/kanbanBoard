import React from 'react';
import { useCreateBoardForm } from '../../hooks/useCreateBoardForm';
import { generateHashedId } from '../../utils/id.utils';
import Button from '../ui/button/Button';

interface CreateBoardFormProps {
	onBoardCreated: (newId: string) => void;

	onCancel?: () => void;
}

const CreateBoardForm: React.FC<CreateBoardFormProps> = ({
	onBoardCreated,
	onCancel,
}) => {
	const {
		name,
		uniqueHashedId,
		isLoading,
		setName,
		setUniqueHashedId,
		handleSubmit,
	} = useCreateBoardForm({ onSuccess: onBoardCreated });

	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		}
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
			<form
				onSubmit={handleSubmit}
				onClick={e => e.stopPropagation()}
				className='p-6 bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4 relative'
			>
				<h2 className='text-xl font-bold mb-4'>Create New Board</h2>
				<div className='mb-4'>
					<label className='block text-sm font-medium text-gray-700'>
						Board Name
					</label>
					<input
						type='text'
						value={name}
						onChange={e => setName(e.target.value)}
						className='w-full p-2 border rounded-md mt-1'
						required
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-sm font-medium text-gray-700'>
						Unique ID (e.g., TEAM-001)
					</label>
					<div className='flex space-x-2'>
						<input
							type='text'
							value={uniqueHashedId}
							onChange={e => setUniqueHashedId(e.target.value.toUpperCase())}
							className='w-full p-2 border rounded-md mt-1 font-mono'
							required
						/>
						<Button
							type='button'
							variant='secondary'
							onClick={() => setUniqueHashedId(generateHashedId())}
							className='mt-1'
						>
							Generate
						</Button>
					</div>
				</div>
				<div className='flex justify-end space-x-3 mt-6'>
					<Button type='button' variant='ghost' onClick={handleCancel}>
						Cancel
					</Button>

					<Button type='submit' variant='primary' isLoading={isLoading}>
						{isLoading ? 'Creating...' : 'Create Board'}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default CreateBoardForm;
