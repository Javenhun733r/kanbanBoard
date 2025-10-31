import { useCreateBoardMutation } from '@api/boardApi';
import { isApiError } from '@utils/api.utils';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

interface CreateBoardFormOptions {
	onSuccess: (newId: string) => void;
}

export const useCreateBoardForm = ({ onSuccess }: CreateBoardFormOptions) => {
	const [name, setName] = useState('New Project Board');
	const [createBoard, { isLoading }] = useCreateBoardMutation();

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			if (!name.trim()) {
				toast.error('Board name cannot be empty.');
				return;
			}

			try {
				const result = await createBoard({
					name: name.trim(),
				}).unwrap();

				toast.success(`Board "${result.name}" created successfully!`);
				onSuccess(result.uniqueHashedId);

				setName('New Project Board');
			} catch (error: unknown) {
				console.error('Error creating board:', error);
				const status = isApiError(error) ? error.status : 'Unknown';
				toast.error(`Failed to create board. Status: ${status}`);
			}
		},
		[name, createBoard, onSuccess]
	);

	return {
		name,
		isLoading,
		setName,
		handleSubmit,
	};
};
