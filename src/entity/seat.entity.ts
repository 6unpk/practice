import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
@Unique({ properties: ['theaterId', 'seatRow', 'seatColumn'] })
export class Seat {
  @PrimaryKey()
  id!: number;

  @Property()
  theaterId!: number;

  @Property()
  seatRow!: string;

  @Property()
  seatColumn!: number;

  @Property()
  isReserved: boolean = false;
}
