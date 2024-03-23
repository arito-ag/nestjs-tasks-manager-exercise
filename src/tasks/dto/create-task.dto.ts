export class CreateTaskDto {
  title: string;
  description: string;
  deadline: string;
  comments?: string;
  tags?: string;
  file?: string;
  userId: number;
}
