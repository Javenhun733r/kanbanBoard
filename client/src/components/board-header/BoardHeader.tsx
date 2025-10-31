import Button from '@components/ui/button/Button';
import { HomeIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BoardActions from './board-actions/BoardActions';
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
	allHashIds: string[];
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
	allHashIds,
}) => {
	const navigate = useNavigate();

	const navigateHome = () => {
		navigate('/');
	};
	return (
		<div className='p-6 bg-white shadow-md fixed top-0 w-full z-10'>
			<div className='flex items-center justify-end'>
				<Button
					onClick={navigateHome}
					variant='ghost'
					className='pb-3 text-gray-60'
				>
					<HomeIcon className='w-11 h-11' />
				</Button>
				<BoardSearch
					inputBoardId={inputBoardId}
					loadedBoardId={loadedBoardId}
					isLoading={isLoading}
					isFetching={isFetching}
					setInputBoardId={setInputBoardId}
					handleLoadBoard={() => handleLoadBoard(inputBoardId)}
					allHashIds={allHashIds}
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

export default React.memo(BoardHeader);
