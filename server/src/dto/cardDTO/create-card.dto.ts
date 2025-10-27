import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
export class CreateCardDto {
  @IsString({ message: 'Заголовок картки має бути рядком.' })
  @IsNotEmpty({ message: 'Заголовок картки не може бути пустим.' })
  @MaxLength(255)
  title: string;

  @IsString({ message: 'Опис картки має бути рядком.' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'Колонка має бути рядком.' })
  @IsNotEmpty({ message: 'Колонка має бути вказана.' })
  column: 'ToDo' | 'InProgress' | 'Done';
}
