import { IsNotEmpty, Length } from 'class-validator';

interface CreateTodoBody {
  title: string;
  author: string;
  description?: string;
  priority?: number;
}

export class CreateTodoDto implements CreateTodoBody {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @Length(1, 255)
  author: string;

  description?: string;

  priority?: number;
}
