import { useState } from 'react';
import { useCreateCardMutation } from '../api/boardApi';
import type { ColumnStatus } from '../entities/board.entity';

const INITIAL_STATE = {
	title: '',
	description: '',
	column: 'ToDo' as ColumnStatus,
};

interface CreateCardFormOptions {
	uniqueHashedId: string;
	onSuccess: () => void;
}

export const useCreateCardForm = ({
	uniqueHashedId,
	onSuccess,
}: CreateCardFormOptions) => {
	const [formData, setFormData] = useState(INITIAL_STATE);
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

			setFormData(INITIAL_STATE);
			setIsFormVisible(false);
			onSuccess();
		} catch (err) {
			console.error('Помилка створення картки:', err);
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
		// Додаємо метод для зміни колонки
		setColumn: (col: ColumnStatus) =>
			setFormData(prev => ({ ...prev, column: col })),
	};
};
