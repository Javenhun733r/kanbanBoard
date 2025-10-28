import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useCreateBoardMutation } from '../api/boardApi';
import { isApiError } from '../utils/api.utils';
import { generateHashedId } from '../utils/id.utils';

interface CreateBoardFormOptions {
	onSuccess: (newId: string) => void;
}

export const useCreateBoardForm = ({ onSuccess }: CreateBoardFormOptions) => {
	const [name, setName] = useState('New Project Board');
	const [uniqueHashedId, setUniqueHashedId] = useState(generateHashedId());
	const [createBoard, { isLoading }] = useCreateBoardMutation();

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			if (!name.trim() || !uniqueHashedId.trim()) {
				toast.error('Board name and ID cannot be empty.');
				return;
			}

			try {
				const result = await createBoard({
					name: name.trim(),
					uniqueHashedId: uniqueHashedId.trim(),
				}).unwrap();

				toast.success(`Board "${result.name}" created successfully!`);
				onSuccess(result.uniqueHashedId);

				setName('New Project Board');
				setUniqueHashedId(generateHashedId());
			} catch (error: unknown) {
				console.error('Error creating board:', error);
				const status = isApiError(error) ? error.status : 'Unknown';
				toast.error(`Failed to create board. Status: ${status}`);
			}
		},
		[name, uniqueHashedId, createBoard, onSuccess]
	);

	return {
		name,
		uniqueHashedId,
		isLoading,
		setName,
		setUniqueHashedId,
		handleSubmit,
	};
};
