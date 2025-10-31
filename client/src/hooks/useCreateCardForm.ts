import { useCreateCardMutation } from '@api/boardApi';
import type { ColumnStatus } from '@appTypes/entities/board.entity';
import { useState } from 'react';

const INITIAL_STATE = {
	title: '',
	description: '',
	column: '' as ColumnStatus,
};

interface CreateCardFormOptions {
	uniqueHashedId: string;
	onSuccess: () => void;
	initialColumn: ColumnStatus;
}

export const useCreateCardForm = ({
	uniqueHashedId,
	onSuccess,
	initialColumn,
}: CreateCardFormOptions) => {
	const [formData, setFormData] = useState(() => ({
		...INITIAL_STATE,
		column: initialColumn,
	}));
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [createCard, { isLoading, error }] = useCreateCardMutation();

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.title || !formData.description) return;

		try {
			await createCard({
				uniqueHashedId,
				payload: {
					title: formData.title,
					description: formData.description,
					column: formData.column,
				},
			}).unwrap();

			setFormData({
				...INITIAL_STATE,
				column: initialColumn,
			});
			setIsFormVisible(false);
			onSuccess();
		} catch (err) {
			console.error('Error creating card:', err);
		}
	};

	return {
		formData,
		isFormVisible,
		isLoading,
		error,
		setIsFormVisible,
		handleInputChange,
		handleSubmit,

		setColumn: (col: ColumnStatus) =>
			setFormData(prev => ({ ...prev, column: col })),
	};
};
