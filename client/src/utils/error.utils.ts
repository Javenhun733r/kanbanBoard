import { isApiError } from './api.utils';

type ApiErrorData = { message?: string } | string;

interface FormattedError {
	statusText: string;
	finalMessage: string;
}

export const formatApiError = (
	error: unknown,
	loadedBoardId: string
): FormattedError => {
	const apiError = isApiError(error) ? error : undefined;
	const statusText = apiError?.status
		? `Status: ${apiError.status}`
		: 'Unknown Status';

	let detailedMessage = '';

	if (apiError && apiError.data) {
		const errorData = apiError.data as ApiErrorData;

		if (
			typeof errorData === 'object' &&
			errorData !== null &&
			'message' in errorData
		) {
			detailedMessage = errorData.message || '';
		} else if (typeof errorData === 'string') {
			detailedMessage = errorData;
		}
	}

	const finalMessage =
		detailedMessage ||
		`Failed to load board ${loadedBoardId}. Please check the ID.`;

	return {
		statusText,
		finalMessage,
	};
};
