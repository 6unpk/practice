import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PollService {
  private polls: Array<{
    id: string;
    topic: string;
    choices: string[];
    vote: number[];
  }> = [];

  createPoll(poll: { topic: string; choices: string[] }) {
    const id = uuidv4();
    if (poll.choices.length === 0) {
      throw new HttpException('empty choices', HttpStatus.BAD_REQUEST);
    }
    const vote = poll.choices.map(() => 0);
    const pollWithId = { id, ...poll, vote };
    this.polls.push(pollWithId);
    return pollWithId;
  }

  getPolls() {
    return this.polls;
  }

  vote(id: string, choice: string) {
    const poll = this.polls.find((poll) => poll.id === id);
    if (!poll) {
      throw new HttpException('empty choices', HttpStatus.BAD_REQUEST);
    }
    const choiceIndex = poll.choices.findIndex((c) => c === choice);
    if (choiceIndex === -1) {
      throw new HttpException('empty choices', HttpStatus.BAD_REQUEST);
    }

    poll.vote[choiceIndex] += 1;
  }

  getPoll(id: string) {
    const pollIndex = this.polls.findIndex((poll) => poll.id === id);
    if (pollIndex === -1) {
      throw new HttpException('empty choices', HttpStatus.BAD_REQUEST);
    }

    return this.polls[pollIndex];
  }

  deletePoll(id: string) {
    const pollIndex = this.polls.findIndex((poll) => poll.id === id);
    if (pollIndex === -1) {
      throw new HttpException('empty choices', HttpStatus.BAD_REQUEST);
    }

    this.polls.splice(pollIndex, 1);
  }
}
