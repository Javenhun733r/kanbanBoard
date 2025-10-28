export const generateHashedId = () =>
	Math.random().toString(36).substring(2, 7).toUpperCase();
