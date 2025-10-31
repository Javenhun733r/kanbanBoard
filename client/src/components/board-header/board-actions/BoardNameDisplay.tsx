import { useUpdateBoardMutation } from '@api/boardApi';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@components/ui/button/Button';

interface BoardNameDisplayProps {
	loadedBoardId: string;
	loadedBoardName: string | undefined;
}

const BoardNameDisplay: React.FC<BoardNameDisplayProps> = ({
	loadedBoardId,
	loadedBoardName,
}) => {
	const [isEditingName, setIsEditingName] = useState(false);
	const [boardNameInput, setBoardNameInput] = useState(loadedBoardName || '');
	const [updateBoard, { isLoading: isUpdating }] = useUpdateBoardMutation();

	useEffect(() => {
		setBoardNameInput(loadedBoardName || '');
	}, [loadedBoardName]);

	const handleSaveName = async (e: React.FormEvent) => {
		e.preventDefault();
		const newName = boardNameInput.trim();

		if (!loadedBoardId || !newName || newName === loadedBoardName) {
			setIsEditingName(false);
			return;
		}

		try {
			await updateBoard({
				uniqueHashedId: loadedBoardId,
				payload: { name: newName },
			}).unwrap();

			toast.success('Board name updated.');
			setIsEditingName(false);
		} catch (error) {
			console.error('Failed to update board name:', error);
			toast.error('Failed to update board name.');
		}
	};

	return (
		<div className='flex items-center'>
			{isEditingName && loadedBoardId ? (
				<form onSubmit={handleSaveName} className='flex items-center space-x-2'>
					<input
						type='text'
						value={boardNameInput}
						onChange={e => setBoardNameInput(e.target.value)}
						className='text-2xl font-bold text-gray-800 border-b border-indigo-600 focus:outline-none'
						style={{ minWidth: '300px' }}
						autoFocus
					/>
					<Button
						type='submit'
						variant='primary'
						isLoading={isUpdating}
						className='px-2 py-1'
					>
						Save
					</Button>
					<Button
						type='button'
						variant='ghost'
						onClick={() => {
							setIsEditingName(false);
							setBoardNameInput(loadedBoardName || '');
						}}
						className='text-sm p-1'
					>
						Cancel
					</Button>
				</form>
			) : (
				<h1
					className='text-2xl font-bold text-gray-800 mr-4 cursor-pointer hover:text-indigo-600 transition'
					onClick={() => {
						if (loadedBoardId) setIsEditingName(true);
					}}
				>
					{boardNameInput}
				</h1>
			)}
			<p className='text-lg text-yellow-600 font-semibold'>
				⭐️ {loadedBoardId}
			</p>
		</div>
	);
};

export default BoardNameDisplay;
