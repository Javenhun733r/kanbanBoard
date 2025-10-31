import Button from '@components/ui/button/Button';
import React from 'react';
interface BoardSearchProps {
	inputBoardId: string;
	loadedBoardId: string;
	isLoading: boolean;
	isFetching: boolean;
	setInputBoardId: (id: string) => void;
	handleLoadBoard: () => void;
	allHashIds: string[];
}

const BoardSearch: React.FC<BoardSearchProps> = ({
	inputBoardId,
	loadedBoardId,
	isLoading,
	isFetching,
	setInputBoardId,
	handleLoadBoard,
	allHashIds,
}) => {
	const filteredIds =
		inputBoardId.length > 0
			? allHashIds
					.filter(
						id =>
							id.toLowerCase().includes(inputBoardId.toLowerCase()) &&
							id !== inputBoardId
					)
					.slice(0, 5)
			: [];

	const showSuggestions = filteredIds.length > 0 && !isLoading && !isFetching;

	return (
		<div className='flex items-start space-x-2 w-full justify-end mb-3 relative'>
			<div className='grow relative'>
				<input
					type='text'
					value={inputBoardId}
					onChange={e => setInputBoardId(e.target.value)}
					className='border rounded-md p-1 text-gray-700 w-full h-10'
					placeholder='Enter Board ID (e.g., TEST-001)'
				/>

				{showSuggestions && (
					<div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto'>
						{filteredIds.map(id => (
							<div
								key={id}
								className='px-3 py-2 cursor-pointer hover:bg-indigo-50 text-gray-800 text-sm'
								onClick={() => {
									setInputBoardId(id);
								}}
							>
								{id}
							</div>
						))}
					</div>
				)}
			</div>

			<Button
				onClick={handleLoadBoard}
				variant='primary'
				isLoading={isLoading || isFetching}
				disabled={inputBoardId === loadedBoardId || !inputBoardId}
				className='px-4 py-1 h-10'
			>
				{isLoading || isFetching ? 'Loading...' : 'Load Board'}
			</Button>
		</div>
	);
};

export default BoardSearch;
