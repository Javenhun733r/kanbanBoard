import { EditIcon, TrashIcon } from 'lucide-react';
import React from 'react';
import type { Card } from '../../entities/board.entity';
import { calculateTimeAgo } from '../../utils/date.utils';
import Button from '../ui/button/Button';
interface CardViewContentProps {
	card: Card;
	isDeleting: boolean;
	setIsEditing: (isEditing: boolean) => void;
	handleDelete: (e: React.MouseEvent) => void;
}

const CardViewContent: React.FC<CardViewContentProps> = ({
	card,
	isDeleting,
	setIsEditing,
	handleDelete,
}) => {
	const iconButtonClasses = 'text-gray-400 p-1 rounded hover:bg-gray-100';
	const timeAgo = calculateTimeAgo(card.updatedAt);
	return (
		<>
			<div className='flex justify-between items-start'>
				<h4 className='font-semibold text-gray-900 text-sm w-4/5'>
					{card.title}
				</h4>
				<div className='flex space-x-1 opacity-0 group-hover:opacity-100 transition'>
					<Button
						type='button'
						variant='ghost'
						onClick={e => {
							e.stopPropagation();
							setIsEditing(true);
						}}
						className={`${iconButtonClasses} hover:text-indigo-600`}
					>
						<EditIcon size={16} />
					</Button>

					<Button
						type='button'
						variant='ghost'
						onClick={handleDelete}
						disabled={isDeleting}
						isLoading={isDeleting}
						className={`${iconButtonClasses} hover:text-red-600`}
					>
						<TrashIcon size={16} />
					</Button>
				</div>
			</div>
			{card.description && (
				<p className='text-xs text-gray-700 mt-1 line-clamp-3'>
					{card.description}
				</p>
			)}
			<div className='text-xs text-gray-500 mt-2'>
				<p>
					#{card.id.substring(0, 5)} updated{' '}
					<span className='font-semibold'>{timeAgo}</span>
					{timeAgo !== 'today' && ' ago'}
				</p>
			</div>
		</>
	);
};

export default CardViewContent;
