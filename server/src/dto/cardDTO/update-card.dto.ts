import { IsOptional, IsString, MaxLength } from 'class-validator';
export class UpdateCardDto {
  @IsString({ message: 'Заголовок картки має бути рядком.' })
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString({ message: 'Опис картки має бути рядком.' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'Колонка має бути рядком.' })
  @IsOptional()
  column?: 'ToDo' | 'InProgress' | 'Done';
}
