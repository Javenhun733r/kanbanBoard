import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateCardPositionDto {
  @IsUUID('4', { message: 'Card ID must be a valid UUID.' })
  cardId: string;

  @IsString({ message: 'New column must be a string.' })
  @IsNotEmpty({ message: 'New column must be specified.' })
  newColumn: 'ToDo' | 'InProgress' | 'Done';

  @IsInt({ message: 'New position index must be an integer.' })
  @Type(() => Number)
  newOrderIndex: number;
}
