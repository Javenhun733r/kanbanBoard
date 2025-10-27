import { useState } from 'react';
import { useGetBoardQuery } from './api/boardApi';
import Board from './components/board/Board';

function App() {
	const [boardId, setBoardId] = useState<string>('TEST-001');

	const { data, error, isLoading, isFetching } = useGetBoardQuery(boardId, {
		skip: !boardId,
	});

	const boardData = data;

	const handleLoadBoard = () => {};

	const headerContent = (
		<div className='p-6 bg-white shadow-md'>
			<div className='flex items-center justify-between'>
				<h1 className='text-xl font-bold text-gray-800'>Kanban Task Board</h1>
				<div className='flex items-center space-x-2'>
					<input
						type='text'
						value={boardId}
						onChange={e => setBoardId(e.target.value)}
						className='border rounded-md p-1 text-gray-700 w-64 h-8'
						placeholder='Enter Board ID (e.g., TEST-001)'
					/>
					<button
						onClick={handleLoadBoard}
						className='bg-indigo-600 text-white px-4 py-1 rounded-md text-sm hover:bg-indigo-700 transition'
						disabled={isLoading || isFetching}
					>
						{isLoading || isFetching ? 'Завантаження...' : 'Load Board'}
					</button>
				</div>
			</div>

			<p className='mt-2 text-xs text-gray-400'>
				Currently loaded ID: <span className='font-mono'>{boardId}</span>
			</p>
		</div>
	);

	if (isLoading || isFetching) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-gray-100'>
				{headerContent}
				<div className='text-xl font-semibold text-indigo-500'>
					Завантаження дошки...
				</div>
			</div>
		);
	}

	if (error && !data) {
		return (
			<div className='p-10 bg-gray-100 min-h-screen'>
				{headerContent}
				<div className='text-red-600 border border-red-300 bg-red-50 p-4 rounded-lg mb-6'>
					<h2 className='font-bold'>Помилка завантаження API</h2>
					<p>
						Не вдалося завантажити дошку з ID {boardId}. Статус: {'Unknown'}.
					</p>
				</div>
			</div>
		);
	}
	return (
		<div className='min-h-screen bg-gray-100'>
			{headerContent}
			<Board boardData={boardData} />
		</div>
	);
}

export default App;
