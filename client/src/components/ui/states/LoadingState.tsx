import React from 'react';
interface LoadingStateProps {
	header: React.ReactNode;
}
const LoadingState: React.FC<LoadingStateProps> = ({ header }) => {
	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-50'>
			{header}
			<div className='flex flex-col items-center space-y-4'>
				<div className='w-12 h-12 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent'></div>
				<p className='text-gray-600 text-lg font-medium'>Loading board...</p>
			</div>
		</div>
	);
};

export default LoadingState;
