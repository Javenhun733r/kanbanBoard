import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BoardRepository } from '../../board/repository/board.repository';
import { RequestWithBoard } from '../interfaces/request-with-board.interface';

@Injectable()
export class BoardExistsGuard implements CanActivate {
  constructor(private readonly boardRepository: BoardRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithBoard>();
    const uniqueHashedId = request.params.uniqueHashedId;

    if (!uniqueHashedId) {
      return true;
    }

    const board = await this.boardRepository.findByUniqueId(uniqueHashedId);

    if (!board) {
      throw new NotFoundException(
        `Board with ID "${uniqueHashedId}" not found.`,
      );
    }

    request.board = board;
    return true;
  }
}
