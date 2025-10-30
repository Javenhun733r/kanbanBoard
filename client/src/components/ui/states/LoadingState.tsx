import React from 'react';

interface LoadingStateProps {
	header: React.ReactNode;
}

const LoadingState: React.FC<LoadingStateProps> = ({ header }) => {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
			{header}
			<div className='p-8 bg-white rounded-lg shadow-xl mt-8'>
				<div className='text-xl font-semibold text-indigo-500'>
					Loading board...
				</div>
			</div>
		</div>
	);
};

export default LoadingState;
