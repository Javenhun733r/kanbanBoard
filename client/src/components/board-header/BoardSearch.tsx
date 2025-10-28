import React from 'react';
import Button from '../ui/button/Button';

interface BoardSearchProps {
	inputBoardId: string;
	loadedBoardId: string;
	isLoading: boolean;
	isFetching: boolean;
	setInputBoardId: (id: string) => void;
	handleLoadBoard: () => void;
}

const BoardSearch: React.FC<BoardSearchProps> = ({
	inputBoardId,
	loadedBoardId,
	isLoading,
	isFetching,
	setInputBoardId,
	handleLoadBoard,
}) => {
	return (
		<div className='flex items-center space-x-2 w-full justify-end mb-3'>
			<input
				type='text'
				value={inputBoardId}
				onChange={e => setInputBoardId(e.target.value)}
				className='border rounded-md p-1 text-gray-700 grow h-10'
				placeholder='Enter Board ID (e.g., TEST-001)'
			/>

			<Button
				onClick={handleLoadBoard}
				variant='primary'
				isLoading={isLoading || isFetching}
				disabled={inputBoardId === loadedBoardId}
				className='px-4 py-1 h-10'
			>
				{isLoading || isFetching ? 'Loading...' : 'Load Board'}
			</Button>
		</div>
	);
};

export default BoardSearch;
