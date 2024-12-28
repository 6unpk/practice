import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreatePollDto, VoteDto } from 'src/dto/poll';
import { PollService } from 'src/service/poll.service';

@Controller('polls')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post('')
  createPoll(@Body() createPollDto: CreatePollDto) {
    return this.pollService.createPoll(createPollDto);
  }

  @Get('')
  getPolls() {
    return this.pollService.getPolls();
  }

  @Post(':id/vote')
  vote(@Param('id') pollId: string, @Body() voteDto: VoteDto) {
    return this.pollService.vote(pollId, voteDto.choice);
  }

  @Get(':id')
  getPoll(@Param('id') pollId: string) {
    return this.pollService.getPoll(pollId);
  }

  @Delete(':id')
  deletePoll(@Param('id') pollId: string) {
    return this.pollService.deletePoll(pollId);
  }
}
