import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from 'src/dto/todo';

@Injectable()
export class TodoService {
  private todo: { id: number; title: string }[] = [];

  getTodos() {
    return this.todo;
  }

  createTodo(createTodoBody: CreateTodoDto) {
    throw new Error('Not implemented');

    this.todo.push({
      id: this.todo.length + 1,
      title: createTodoBody.title,
    });
  }
}
