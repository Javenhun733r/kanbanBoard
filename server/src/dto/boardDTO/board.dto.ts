import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class BoardDto {
  @IsString({ message: 'Board name must be a string.' })
  @IsNotEmpty({ message: 'Board name cannot be empty.' })
  @MaxLength(255)
  name: string;
}
