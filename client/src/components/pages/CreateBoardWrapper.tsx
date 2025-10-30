import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllHashIdsQuery } from '../../api/boardApi';
import { useBoardApp } from '../../hooks/useBoardApp';
import BoardHeader from '../board-header/BoardHeader';
import CreateBoardForm from '../board/CreateBoardForm';

const CreateBoardWrapper: React.FC = () => {
	const navigate = useNavigate();

	const { resetIdsAndExitCreate, handleBoardCreated, headerProps } =
		useBoardApp(undefined);
	const { data: allHashIds = [] } = useGetAllHashIdsQuery();
	const handleCancelCreate = () => {
		resetIdsAndExitCreate();
		navigate('/');
	};

	const handleBoardCreatedAndRedirect = (newId: string) => {
		handleBoardCreated();
		navigate(`/board/${newId}`);
	};

	const updatedHeaderProps = {
		...headerProps,
		loadedBoardId: headerProps.loadedBoardId || '',
		handleLoadBoard: (id: string) => navigate(`/board/${id}`),
		onCreateNewBoard: handleCancelCreate,
		allHashIds: allHashIds,
	};

	return (
		<div className='min-h-screen bg-gray-100'>
			<BoardHeader {...updatedHeaderProps} />
			<CreateBoardForm
				onBoardCreated={handleBoardCreatedAndRedirect}
				onCancel={handleCancelCreate}
			/>
		</div>
	);
};

export default CreateBoardWrapper;
