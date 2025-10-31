import { useDeleteBoardMutation } from '@api/boardApi';
import Button from '@components/ui/button/Button';
import { PlusIcon, TrashIcon } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

interface BoardManagementButtonsProps {
	loadedBoardId: string;
	loadedBoardName: string | undefined;
	onCreateNewBoard: () => void;
	onDeleteSuccess: () => void;
}

const BoardManagementButtons: React.FC<BoardManagementButtonsProps> = ({
	loadedBoardId,
	loadedBoardName,
	onCreateNewBoard,
	onDeleteSuccess,
}) => {
	const [deleteBoard, { isLoading: isDeleting }] = useDeleteBoardMutation();

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

	return (
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
	);
};

export default BoardManagementButtons;
