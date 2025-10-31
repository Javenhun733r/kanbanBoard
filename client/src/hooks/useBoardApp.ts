import { useCallback, useMemo, useState } from 'react';
import { boardsApi, useGetBoardQuery } from '../api/boardApi';
import { store } from '../store/store';

export const useBoardApp = (currentBoardId: string | undefined) => {
	const [inputBoardId, setInputBoardId] = useState<string>(
		currentBoardId || ''
	);
	const [isCreatingBoard, setIsCreatingBoard] = useState(false);

	const resetBoardQueryCache = useCallback((id: string) => {
		store.dispatch(boardsApi.util.invalidateTags([{ type: 'Board', id: id }]));
	}, []);

	const { data, error, isLoading, isFetching } = useGetBoardQuery(
		currentBoardId || '',
		{
			skip: !currentBoardId || isCreatingBoard,
			selectFromResult: result => ({
				...result,
			}),
		}
	);

	const resetIdsAndExitCreate = useCallback(() => {
		setIsCreatingBoard(false);
		setInputBoardId('');
	}, []);

	const handleCreateNewBoard = useCallback(() => {
		setIsCreatingBoard(true);
		setInputBoardId('');
	}, []);

	const handleBoardCreated = useCallback(() => {
		setIsCreatingBoard(false);
	}, []);

	const handleBoardDeletedSuccess = useCallback(() => {}, []);
	const handleLoadBoardStub = useCallback(() => {}, []);
	const isError = !!error;
	const isInitialLoading = isLoading || isFetching;

	const headerProps = useMemo(() => {
		return {
			inputBoardId,
			loadedBoardId: currentBoardId,
			isLoading: isLoading,
			isFetching: isFetching,
			loadedBoardName: data?.name,
			setInputBoardId,
			handleLoadBoard: handleLoadBoardStub,
			resetBoardQueryCache,
			onCreateNewBoard: handleCreateNewBoard,
			onDeleteSuccess: handleBoardDeletedSuccess,
		};
	}, [
		inputBoardId,
		currentBoardId,
		isLoading,
		isFetching,
		data?.name,
		setInputBoardId,
		handleLoadBoardStub,
		resetBoardQueryCache,
		handleCreateNewBoard,
		handleBoardDeletedSuccess,
	]);

	return useMemo(() => {
		return {
			data,
			error,
			isCreatingBoard,
			isError,
			isInitialLoading,
			setInputBoardId,
			setIsCreatingBoard,
			onBoardDeleted: handleBoardDeletedSuccess,
			resetIdsAndExitCreate,
			handleBoardCreated,
			headerProps,
		};
	}, [
		data,
		error,
		isCreatingBoard,
		isError,
		isInitialLoading,
		setInputBoardId,
		setIsCreatingBoard,
		handleBoardDeletedSuccess,
		resetIdsAndExitCreate,
		handleBoardCreated,
		headerProps,
	]);
};
