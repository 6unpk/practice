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

@Module({
  imports: [TodoModule, AuthModule, PollModule],
  controllers: [AppController, AuthController, PollController],
  providers: [AppService, AuthService, PollService],
})
export class AppModule {}
