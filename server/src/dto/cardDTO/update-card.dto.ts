import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCardDto {
  @IsString({ message: 'Card title must be a string.' })
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString({ message: 'Card description must be a string.' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'Column must be a string.' })
  @IsOptional()
  column?: 'ToDo' | 'InProgress' | 'Done';
}
