import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { MovieService } from '../service/movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async findAll(@Query('includeDeleted') includeDeleted?: boolean) {
    return this.movieService.findAll(includeDeleted);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.movieService.findOne(id);
  }

  @Post()
  async create(
    @Body('title') title: string,
    @Body('genre') genre: string,
    @Body('duration') duration: number,
  ) {
    return this.movieService.create(title, genre, duration);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: number) {
    return this.movieService.softDelete(id);
  }

  // TODO: implement update endpoint
  // TODO: implement search endpoints
  // TODO: implement admin-only hard delete endpoint
}