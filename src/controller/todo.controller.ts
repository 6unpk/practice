import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTodoDto } from 'src/dto/todo';
import { TodoService } from 'src/service/todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getTodos() {
    return this.todoService.getTodos();
  }

  @Post()
  createTodo(@Body() createTodoBody: CreateTodoDto) {
    this.todoService.createTodo(createTodoBody);
  }
}
