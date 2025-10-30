import React from 'react';
import BoardManagementButtons from './BoardManagementButtons';
import BoardNameDisplay from './BoardNameDisplay';

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
	return (
		<div className='flex items-center justify-between border-t pt-4'>
			<BoardNameDisplay
				loadedBoardId={loadedBoardId}
				loadedBoardName={loadedBoardName}
			/>

			<BoardManagementButtons
				loadedBoardId={loadedBoardId}
				loadedBoardName={loadedBoardName}
				onCreateNewBoard={onCreateNewBoard}
				onDeleteSuccess={onDeleteSuccess}
			/>
		</div>
	);
};

export default BoardActions;
