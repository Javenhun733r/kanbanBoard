import React, { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetAllHashIdsQuery } from '../../api/boardApi';
import { useBoardApp } from '../../hooks/useBoardApp';
import { formatApiError } from '../../utils/error.utils';
import BoardHeader from '../board-header/BoardHeader';
import Board from '../board/Board';
import LoadingState from '../ui/states/LoadingState';
import StatusWrapper from '../ui/wrappers/StatusWrapper';

const BoardPage: React.FC = () => {
	const { boardId } = useParams<{ boardId: string }>();
	const navigate = useNavigate();
	const { data, error, isError, isInitialLoading, headerProps } =
		useBoardApp(boardId);
	const { data: allHashIds = [] } = useGetAllHashIdsQuery();
	const handleLoadBoard = useCallback(
		(idToLoad: string) => {
			if (idToLoad && idToLoad !== boardId) {
				navigate(`/board/${idToLoad}`);
			}
		},
		[navigate, boardId]
	);

	const handleCreateNewBoard = useCallback(() => {
		navigate('/create');
	}, [navigate]);

	const handleBoardDeletedSuccess = useCallback(() => {
		navigate('/');
	}, [navigate]);

	const updatedHeaderProps = useMemo(() => {
		return {
			...headerProps,
			loadedBoardId: boardId || '',
			handleLoadBoard: handleLoadBoard,
			onCreateNewBoard: handleCreateNewBoard,
			onDeleteSuccess: handleBoardDeletedSuccess,
			allHashIds: allHashIds,
		};
	}, [
		headerProps,
		boardId,
		handleLoadBoard,
		handleCreateNewBoard,
		handleBoardDeletedSuccess,
		allHashIds,
	]);

	const headerComponent = <BoardHeader {...updatedHeaderProps} />;

	if (isInitialLoading) {
		return <LoadingState header={headerComponent} />;
	}

	if (isError) {
		const { statusText, finalMessage } = formatApiError(error, boardId || '');

		return (
			<StatusWrapper header={headerComponent}>
				<div className='text-red-600 border border-red-300 bg-red-50 p-4 rounded-lg mt-6'>
					<h2 className='font-bold text-lg'>
						Error loading board ({statusText})
					</h2>
					<p className='mt-1'>{finalMessage}</p>
				</div>
			</StatusWrapper>
		);
	}

	if (!data) {
		return (
			<StatusWrapper header={headerComponent}>
				<div className='text-gray-500 border border-gray-300 bg-white p-4 rounded-lg mt-6'>
					<h2 className='font-bold text-lg'>Board not found</h2>
					<p className='mt-1'>
						The board with ID "{boardId}" does not exist or has been deleted.
					</p>
				</div>
			</StatusWrapper>
		);
	}

	return (
		<div className='min-h-screen bg-gray-100 pt-[150px]'>
			{headerComponent}
			<Board boardData={data} />
		</div>
	);
};

export default BoardPage;
