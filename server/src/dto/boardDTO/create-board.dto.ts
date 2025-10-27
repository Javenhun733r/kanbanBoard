import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateBoardDto {
  @IsString({ message: 'Назва дошки має бути рядком.' })
  @IsNotEmpty({ message: 'Назва дошки не може бути пустою.' })
  @MaxLength(255)
  name: string;

  @IsString({ message: 'Публічний ID має бути рядком.' })
  @IsNotEmpty({ message: 'Публічний ID не може бути пустим.' })
  @MaxLength(50)
  uniqueHashedId: string;
}
