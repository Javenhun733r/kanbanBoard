import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBoardDto {
  @IsString({ message: 'Board name must be a string.' })
  @IsNotEmpty({ message: 'Board name cannot be empty.' })
  @MaxLength(255)
  name: string;

  @IsString({ message: 'Public ID must be a string.' })
  @IsNotEmpty({ message: 'Public ID cannot be empty.' })
  @MaxLength(50)
  uniqueHashedId: string;
}

export class UpdateBoardDto extends PartialType(CreateBoardDto) {}
