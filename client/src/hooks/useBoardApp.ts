import { useCallback, useState } from 'react';
import { boardsApi, useGetBoardQuery } from '../api/boardApi';
import { store } from '../store/store';
export const useBoardApp = () => {
	const [inputBoardId, setInputBoardId] = useState<string>('TEST-001');
	const [loadedBoardId, setLoadedBoardId] = useState<string>('TEST-001');
	const [isCreatingBoard, setIsCreatingBoard] = useState(false);
	const resetBoardQueryCache = useCallback((id: string) => {
		store.dispatch(boardsApi.util.invalidateTags([{ type: 'Board', id: id }]));
	}, []);

	const { data, error, isLoading, isFetching } = useGetBoardQuery(
		loadedBoardId,
		{
			skip: !loadedBoardId || isCreatingBoard,
			selectFromResult: result => ({
				...result,
			}),
		}
	);
	const resetIdsAndExitCreate = useCallback(() => {
		setIsCreatingBoard(false);
		setInputBoardId('');
		setLoadedBoardId('');
	}, [setIsCreatingBoard, setInputBoardId, setLoadedBoardId]);
	const handleLoadBoard = useCallback(
		(idToLoad: string) => {
			if (idToLoad) {
				setLoadedBoardId(idToLoad);
				setIsCreatingBoard(false);
			}
		},
		[setLoadedBoardId, setIsCreatingBoard]
	);

	const handleCreateNewBoard = useCallback(() => {
		setIsCreatingBoard(true);
		setInputBoardId('');
		setLoadedBoardId('');
	}, [setLoadedBoardId, setIsCreatingBoard, setInputBoardId]);

	const handleBoardCreated = useCallback(
		(newId: string) => {
			setIsCreatingBoard(false);
			setInputBoardId(newId);
			setLoadedBoardId(newId);
		},
		[setInputBoardId, setLoadedBoardId, setIsCreatingBoard]
	);
	const handleBoardDeletedSuccess = useCallback(() => {
		const deletedId = loadedBoardId;
		setInputBoardId('');
		setLoadedBoardId(`${deletedId}`);
		setIsCreatingBoard(false);
	}, [loadedBoardId]);
	const isError = !!error;
	const isInitialLoading = isLoading || isFetching;

	return {
		data,
		error,
		isCreatingBoard,
		isError,
		isInitialLoading,
		setInputBoardId,
		setLoadedBoardId,
		setIsCreatingBoard,
		onBoardDeleted: handleBoardDeletedSuccess,
		resetIdsAndExitCreate,
		headerProps: {
			inputBoardId,
			loadedBoardId,
			isLoading: isLoading,
			isFetching: isFetching,
			loadedBoardName: data?.name,
			setInputBoardId,
			handleLoadBoard,
			resetBoardQueryCache,
			onCreateNewBoard: handleCreateNewBoard,
			onDeleteSuccess: handleBoardDeletedSuccess,
		},
		handleBoardCreated,
	};
};
