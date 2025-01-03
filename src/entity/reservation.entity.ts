import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Ref,
  Unique,
} from '@mikro-orm/core';
import { MovieUser } from './movie-user.entity';
import { Screening } from './screening.entity';

@Entity()
@Unique({ properties: ['screening', 'seatNumber'] })
export class Reservation {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => MovieUser)
  user!: Ref<MovieUser>;

  @ManyToOne(() => Screening)
  screening!: Ref<Screening>;

  @Property()
  seatNumber!: string;

  @Property()
  reservedAt: Date = new Date();
}
