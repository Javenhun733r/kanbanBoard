import { Toaster } from 'react-hot-toast';
import BoardHeader from './components/board-header/BoardHeader';
import Board from './components/board/Board';
import CreateBoardForm from './components/board/CreateBoardForm';
import { useBoardApp } from './hooks/useBoardApp';
import LoadingState from './states/LoadingState';
import { formatApiError } from './utils/error.utils';
import StatusWrapper from './wrappers/StatusWrapper';

function App() {
	const {
		data,
		error,
		isCreatingBoard,
		isError,
		isInitialLoading,
		headerProps,
		resetIdsAndExitCreate,
		handleBoardCreated,
	} = useBoardApp();

	const handleCancelCreate = () => {
		resetIdsAndExitCreate();
		const currentLoadedId = headerProps.loadedBoardId;
		if (currentLoadedId) {
			headerProps.resetBoardQueryCache(currentLoadedId);
		}
	};

	const headerComponent = <BoardHeader {...headerProps} />;

	if (isCreatingBoard) {
		return (
			<div className='min-h-screen bg-gray-100'>
				{headerComponent}

				<CreateBoardForm
					onBoardCreated={handleBoardCreated}
					onCancel={handleCancelCreate}
				/>
			</div>
		);
	}
	if (isInitialLoading) {
		return <LoadingState header={headerComponent} />;
	}

	if (isError) {
		const { statusText, finalMessage } = formatApiError(
			error,
			headerProps.loadedBoardId
		);

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
					<h2 className='font-bold text-lg'>No board data</h2>
					<p className='mt-1'>Enter a valid board ID and click "Load Board".</p>
				</div>
			</StatusWrapper>
		);
	}

	return (
		<div className='min-h-screen bg-gray-100 pt-[150px]'>
			{headerComponent}
			<Board boardData={data} />
			<Toaster />
		</div>
	);
}

export default App;
