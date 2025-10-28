import React from 'react';
import BoardActions from './BoardActions';
import BoardSearch from './BoardSearch';

interface BoardHeaderProps {
	inputBoardId: string;
	loadedBoardId: string;
	isLoading: boolean;
	isFetching: boolean;
	setInputBoardId: (id: string) => void;
	handleLoadBoard: (idToLoad: string) => void;
	onCreateNewBoard: () => void;
	onDeleteSuccess: () => void;
	loadedBoardName: string | undefined;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({
	inputBoardId,
	loadedBoardId,
	isLoading,
	loadedBoardName,
	isFetching,
	setInputBoardId,
	handleLoadBoard,
	onDeleteSuccess,
	onCreateNewBoard,
}) => {
	return (
		<div className='p-6 bg-white shadow-md fixed top-0 w-full z-10'>
			<div className='flex items-center justify-end'>
				<BoardSearch
					inputBoardId={inputBoardId}
					loadedBoardId={loadedBoardId}
					isLoading={isLoading}
					isFetching={isFetching}
					setInputBoardId={setInputBoardId}
					handleLoadBoard={() => handleLoadBoard(inputBoardId)}
				/>
			</div>

			<BoardActions
				onDeleteSuccess={onDeleteSuccess}
				loadedBoardId={loadedBoardId}
				loadedBoardName={loadedBoardName}
				onCreateNewBoard={onCreateNewBoard}
			/>
		</div>
	);
};

export default BoardHeader;
