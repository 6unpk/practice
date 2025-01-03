import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo.module';
import { AuthModule } from './auth.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { PollModule } from './poll.module';
import { PollController } from './controller/poll.controller';
import { PollService } from './service/poll.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';
import { MovieUserModule } from './movie-user.module';
import { MovieUserController } from './controller/movie-user.controller';
import { MovieUserService } from './service/movie-user.service';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    TodoModule,
    AuthModule,
    PollModule,
    MovieUserModule,
  ],
  controllers: [
    AppController,
    AuthController,
    PollController,
    MovieUserController,
  ],
  providers: [AppService, AuthService, PollService, MovieUserService],
})
export class AppModule {}
