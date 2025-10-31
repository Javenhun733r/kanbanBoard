import { useGetAllHashIdsQuery } from '@api/boardApi';
import BoardHeader from '@components/board-header/BoardHeader';
import Button from '@components/ui/button/Button';
import { useBoardApp } from '@hooks/useBoardApp';
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeWrapper: React.FC = () => {
	const navigate = useNavigate();
	const { headerProps } = useBoardApp(undefined);
	const { data: allHashIds = [], isLoading: isBoardsLoading } =
		useGetAllHashIdsQuery();

	const handleLoadBoard = useCallback(
		(id: string) => {
			if (id) {
				navigate(`/board/${id}`);
			}
		},
		[navigate]
	);

	const handleCreateNewBoard = useCallback(() => {
		navigate('/create');
	}, [navigate]);

	const finalHeaderProps = useMemo(() => {
		return {
			...headerProps,
			loadedBoardId: headerProps.loadedBoardId || '',
			handleLoadBoard: handleLoadBoard,
			onCreateNewBoard: handleCreateNewBoard,
			allHashIds: allHashIds,
		};
	}, [headerProps, handleLoadBoard, handleCreateNewBoard, allHashIds]);

	return (
		<div className='min-h-screen bg-gray-50'>
			<BoardHeader {...finalHeaderProps} />

			<div className='p-8 pt-[150px] max-w-4xl mx-auto'>
				<div className='text-center mb-12 p-10 bg-white rounded-xl shadow-lg'>
					<h1 className='text-4xl font-extrabold text-gray-800 mb-4'>
						Welcome to Kanban Board
					</h1>
					<p className='mt-2 text-lg text-gray-600 mb-6'>
						Organize your workflow. Start by creating a new board or selecting
						one from the list below.
					</p>

					<Button
						variant='primary'
						onClick={handleCreateNewBoard}
						className='text-lg px-8 py-3 shadow-md hover:shadow-xl transition-shadow'
					>
						➕ Create New Board
					</Button>
				</div>

				<div className='mt-12'>
					<h2 className='text-2xl font-bold text-gray-800 mb-6 border-b pb-2'>
						Available Boards ({allHashIds.length})
					</h2>

					{isBoardsLoading && (
						<p className='text-gray-500'>Loading boards...</p>
					)}

					{!isBoardsLoading && allHashIds.length > 0 ? (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
							{allHashIds.map(id => (
								<div
									key={id}
									className='p-5 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-200 cursor-pointer border border-gray-200'
									onClick={() => handleLoadBoard(id)}
								>
									<p className='font-semibold text-lg text-indigo-600 truncate'>
										{id}
									</p>
									<p className='text-sm text-gray-500 mt-1'>Click to open</p>
								</div>
							))}
						</div>
					) : (
						!isBoardsLoading && (
							<p className='text-gray-500 p-4 bg-white rounded-lg'>
								You haven't created any boards yet. Create your first one!
							</p>
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default HomeWrapper;
