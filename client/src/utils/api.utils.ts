export const isApiError = (
	error: unknown
): error is { status: string | number; data: unknown } => {
	return typeof error === 'object' && error !== null && 'status' in error;
};
