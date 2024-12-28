interface PollBody {
  topic: string;
  choices: string[];
}

export class CreatePollDto implements PollBody {
  topic: string;
  choices: string[];
}

export class VoteDto {
  choice: string;
}
