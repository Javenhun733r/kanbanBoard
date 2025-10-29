import { Request } from 'express';
import { Board, Card } from '../../entities/board.entity';
export type BoardWithCards = Board & { cards: Card[] };

export interface RequestWithBoard extends Request {
  board?: BoardWithCards;

  params: {
    uniqueHashedId: string;
    [key: string]: any;
  };
}
