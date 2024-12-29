import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MovieUserService } from 'src/service/movie-user.service';
import { CreateMovieUserDto } from 'src/dto/movie-user';

@Controller('movie-user')
export class MovieUserController {
  constructor(private readonly movieUserService: MovieUserService) {}

  @Post('register')
  register(@Body() registerBody: CreateMovieUserDto) {
    return this.movieUserService.create(registerBody);
  }

  @Get(':id')
  getMovieUser(@Param('id') id: number) {
    return this.movieUserService.findOne(id);
  }
}