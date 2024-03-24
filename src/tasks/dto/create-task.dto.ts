import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsDateString()
  deadline: Date;

  @IsString()
  @IsOptional()
  comments?: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  file?: string;
}
