export const SERVER_URL: string = import.meta.env.VITE_SERVER_URL;
export const API_URL: string = SERVER_URL;
export const BOARDS_API_TAG = 'Board';
export const getBoardUrl = (uniqueHashedId: string) =>
	`/boards/${uniqueHashedId}`;
export const createBoardUrl = '/boards';
export const createCardUrl = (uniqueHashedId: string) =>
	`/boards/${uniqueHashedId}/cards`;
export const updateCardUrl = (cardId: string) => `/boards/cards/${cardId}`;
export const deleteCardUrl = (cardId: string) => `/boards/cards/${cardId}`;
export const updateCardPositionUrl = (uniqueHashedId: string) =>
	`/boards/${uniqueHashedId}/cards/position`;
