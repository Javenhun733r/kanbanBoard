import { PlusIcon, TrashIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
	useDeleteBoardMutation,
	useUpdateBoardMutation,
} from '../../api/boardApi';
import Button from '../ui/button/Button';

interface BoardActionsProps {
	loadedBoardId: string;
	loadedBoardName: string | undefined;
	onCreateNewBoard: () => void;
	onDeleteSuccess: () => void;
}

const BoardActions: React.FC<BoardActionsProps> = ({
	loadedBoardId,
	loadedBoardName,
	onCreateNewBoard,
	onDeleteSuccess,
}) => {
	const [deleteBoard, { isLoading: isDeleting }] = useDeleteBoardMutation();

	const [isEditingName, setIsEditingName] = useState(false);
	const [boardNameInput, setBoardNameInput] = useState(loadedBoardName || '');
	const [updateBoard, { isLoading: isUpdating }] = useUpdateBoardMutation();
	useEffect(() => {
		setBoardNameInput(loadedBoardName || '');
	}, [loadedBoardName]);

	const handleDeleteBoard = async () => {
		if (!loadedBoardId || !loadedBoardName) return;

		if (
			window.confirm(
				`Are you sure you want to delete board "${loadedBoardName}" (${loadedBoardId})?`
			)
		) {
			try {
				await deleteBoard(loadedBoardId).unwrap();
				toast.success(`Board "${loadedBoardName}" deleted.`);

				onDeleteSuccess();
			} catch (error) {
				console.error('Failed to delete board:', error);
				toast.error(`Failed to delete board: ${loadedBoardName}.`);
			}
		}
	};

	const handleSaveName = async (e: React.FormEvent) => {
		e.preventDefault();
		const newName = boardNameInput.trim();

		if (!newName || newName === loadedBoardName) {
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
		<div className='flex items-center justify-between border-t pt-4'>
			<div className='flex items-center'>
				{isEditingName && loadedBoardId ? (
					<form
						onSubmit={handleSaveName}
						className='flex items-center space-x-2'
					>
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

			<div className='flex space-x-3'>
				{loadedBoardName && (
					<Button
						onClick={handleDeleteBoard}
						variant='ghost'
						isLoading={isDeleting}
						disabled={isDeleting}
						className='text-red-600 hover:bg-red-50'
					>
						{isDeleting ? 'Deleting...' : <TrashIcon />}
					</Button>
				)}
				<Button onClick={onCreateNewBoard} variant='secondary'>
					<PlusIcon />
				</Button>
			</div>
		</div>
	);
};

export default BoardActions;
