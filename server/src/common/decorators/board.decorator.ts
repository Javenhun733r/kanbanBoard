import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

import {
  BoardWithCards,
  RequestWithBoard,
} from '../interfaces/request-with-board.interface';

export const BoardFromRequest = createParamDecorator(
  (data: keyof BoardWithCards | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithBoard>();
    const board = request.board;

    if (!board) {
      throw new InternalServerErrorException(
        'Board object not found in request. Ensure BoardExistsGuard is applied.',
      );
    }
    if (data) {
      return board[data] as unknown;
    }

    return board;
  },
);
