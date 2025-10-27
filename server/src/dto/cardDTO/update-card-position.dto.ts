import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';
export class UpdateCardPositionDto {
  @IsUUID('4', { message: 'ID картки має бути дійсним UUID.' })
  cardId: string;

  @IsString({ message: 'Нова колонка має бути рядком.' })
  @IsNotEmpty({ message: 'Потрібно вказати нову колонку.' })
  newColumn: 'ToDo' | 'InProgress' | 'Done';

  @IsInt({ message: 'Новий індекс позиції має бути цілим числом.' })
  @Type(() => Number)
  newOrderIndex: number;
}
