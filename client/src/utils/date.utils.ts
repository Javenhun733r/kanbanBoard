export const calculateTimeAgo = (createdAt: string | number | Date): string => {
	const createdTime = new Date(createdAt).getTime();
	const currentTime = Date.now();
	const diffMs = currentTime - createdTime;
	const MS_PER_DAY = 86400000;
	const daysAgo = Math.floor(diffMs / MS_PER_DAY);

	if (daysAgo <= 0) {
		return 'today';
	}
	if (daysAgo === 1) {
		return '1 day';
	}
	return `${daysAgo} days`;
};
