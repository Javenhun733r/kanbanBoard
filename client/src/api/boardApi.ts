import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
	API_URL,
	BOARDS_API_TAG,
	createBoardUrl,
	createCardUrl,
	deleteCardUrl,
	getBoardUrl,
	updateCardPositionUrl,
	updateCardUrl,
} from '../config/api.config';
import type { BoardResponseDto } from '../dto/board-response.dto';
import type { Card, ColumnStatus } from '../entities/board.entity';

interface UpdatePositionPayload {
	cardId: string;
	newColumn: ColumnStatus;
	newOrderIndex: number;
}
interface CreateBoardPayload {
	name: string;
	uniqueHashedId: string;
}
interface CreateCardPayload {
	title: string;
	description: string;
	column: ColumnStatus;
}

export const boardsApi = createApi({
	reducerPath: 'boardsApi',
	baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
	tagTypes: [BOARDS_API_TAG],
	endpoints: builder => ({
		getBoard: builder.query<BoardResponseDto, string>({
			query: uniqueHashedId => getBoardUrl(uniqueHashedId),
			providesTags: (result, error, uniqueHashedId) => [
				{ type: BOARDS_API_TAG, id: uniqueHashedId },
			],
		}),

		createBoard: builder.mutation<BoardResponseDto, CreateBoardPayload>({
			query: payload => ({
				url: createBoardUrl,
				method: 'POST',
				body: payload,
			}),
			invalidatesTags: [BOARDS_API_TAG],
		}),

		createCard: builder.mutation<
			Card,
			{ uniqueHashedId: string; payload: CreateCardPayload }
		>({
			query: ({ uniqueHashedId, payload }) => ({
				url: createCardUrl(uniqueHashedId),
				method: 'POST',
				body: payload,
			}),
			invalidatesTags: (result, error, { uniqueHashedId }) => [
				{ type: BOARDS_API_TAG, id: uniqueHashedId },
			],
		}),

		updateCard: builder.mutation<
			Card,
			{ cardId: string; payload: Partial<Card> }
		>({
			query: ({ cardId, payload }) => ({
				url: updateCardUrl(cardId),
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: [BOARDS_API_TAG],
		}),
		deleteCard: builder.mutation<
			void,
			{ cardId: string; uniqueHashedId: string }
		>({
			query: ({ cardId }) => ({
				url: deleteCardUrl(cardId),
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, { uniqueHashedId }) => [
				{ type: BOARDS_API_TAG, id: uniqueHashedId },
			],
		}),

		updateCardPosition: builder.mutation<
			Card,
			{ uniqueHashedId: string; payload: UpdatePositionPayload }
		>({
			query: ({ uniqueHashedId, payload }) => ({
				url: updateCardPositionUrl(uniqueHashedId),
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: (result, error, { uniqueHashedId }) => [
				{ type: BOARDS_API_TAG, id: uniqueHashedId },
			],
		}),

		deleteBoard: builder.mutation<void, string>({
			query: uniqueHashedId => ({
				url: getBoardUrl(uniqueHashedId),
				method: 'DELETE',
			}),
			invalidatesTags: [BOARDS_API_TAG],
		}),
	}),
});

export const {
	useGetBoardQuery,
	useCreateBoardMutation,
	useCreateCardMutation,
	useUpdateCardMutation,
	useDeleteCardMutation,
	useDeleteBoardMutation,
	useUpdateCardPositionMutation,
} = boardsApi;
