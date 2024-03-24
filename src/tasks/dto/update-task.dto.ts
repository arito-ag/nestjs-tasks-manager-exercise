import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  deadline?: Date;

  @IsString()
  @IsOptional()
  comments?: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  file?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
