import { Module } from '@nestjs/common';
import { PollController } from './controller/poll.controller';
import { PollService } from './service/poll.service';

@Module({
  imports: [],
  controllers: [PollController],
  providers: [PollService],
})
export class PollModule {}
