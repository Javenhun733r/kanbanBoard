import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCardDto {
  @IsString({ message: 'Card title must be a string.' })
  @IsNotEmpty({ message: 'Card title cannot be empty.' })
  @MaxLength(255)
  title: string;

  @IsString({ message: 'Card description must be a string.' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'Column must be a string.' })
  @IsNotEmpty({ message: 'Column must be specified.' })
  column: 'ToDo' | 'InProgress' | 'Done';
}
