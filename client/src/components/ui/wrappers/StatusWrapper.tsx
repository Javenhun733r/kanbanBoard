import React from 'react';

interface StatusWrapperProps {
	header: React.ReactNode;
	children: React.ReactNode;
}

const FIXED_HEADER_HEIGHT = '150px';

const StatusWrapper: React.FC<StatusWrapperProps> = ({ header, children }) => {
	return (
		<div className='bg-gray-100 min-h-screen'>
			{header}

			<div style={{ paddingTop: FIXED_HEADER_HEIGHT }} className='p-6'>
				{children}
			</div>
		</div>
	);
};

export default StatusWrapper;
