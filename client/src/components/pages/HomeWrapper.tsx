import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllHashIdsQuery } from '../../api/boardApi';
import { useBoardApp } from '../../hooks/useBoardApp';
import BoardHeader from '../board-header/BoardHeader';

const HomeWrapper: React.FC = () => {
	const navigate = useNavigate();
	const { headerProps } = useBoardApp(undefined);
	const { data: allHashIds = [] } = useGetAllHashIdsQuery();

	const handleLoadBoardFromHeader = useCallback(
		(id: string) => {
			if (id) {
				navigate(`/board/${id}`);
			}
		},
		[navigate]
	);

	useMemo(() => {
		return {
			...headerProps,
			loadedBoardId: headerProps.loadedBoardId || '',
			handleLoadBoard: handleLoadBoardFromHeader,
			onCreateNewBoard: () => navigate('/create'),
			allHashIds: allHashIds,
		};
	}, [headerProps, handleLoadBoardFromHeader, navigate, allHashIds]);
	const handleCreateNewBoard = useCallback(
		() => navigate('/create'),
		[navigate]
	);
	const finalHeaderProps = useMemo(() => {
		return {
			...headerProps,
			loadedBoardId: headerProps.loadedBoardId || '',
			handleLoadBoard: handleLoadBoardFromHeader,
			onCreateNewBoard: handleCreateNewBoard,
			allHashIds: allHashIds,
		};
	}, [
		headerProps,
		handleLoadBoardFromHeader,
		handleCreateNewBoard,
		allHashIds,
	]);

	return (
		<div className='min-h-screen bg-gray-100'>
			<BoardHeader {...finalHeaderProps} />

			<div className='p-6 text-center pt-[150px]'>
				<h1 className='text-3xl font-bold text-gray-700'>Welcome!</h1>
				<p className='mt-2 text-gray-500'>
					Use the input field in the header to load a board by ID or create a
					new one.
				</p>
			</div>
		</div>
	);
};

export default HomeWrapper;
