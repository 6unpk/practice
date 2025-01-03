import { EntityManager, QueryOrder, LockMode } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Screening } from '../entity/screening.entity';
import { Movie } from '../entity/movie.entity';

@Injectable()
export class ScreeningService {
  constructor(private readonly em: EntityManager) {}

  async getScreeningsWithAvailability(date: Date) {
    const qb = this.em.createQueryBuilder(Screening, 's');
    return qb
      .select(['s.*', 'm.title', 'm.duration'])
      .leftJoin('s.movie', 'm')
      .where({
        startTime: { $gte: date },
        'm.deletedAt': null,
      })
      .andWhere('s.reservedSeats < s.totalSeats')
      .orderBy({ startTime: QueryOrder.ASC });
  }

  async findAvailableSeats(screeningId: number) {
    const screening = await this.em.findOne(Screening, screeningId, {
      populate: ['movie'],
    });

    if (!screening) {
      throw new NotFoundException('Screening not found');
    }

    return {
      screening,
      availableSeats: screening.totalSeats - screening.reservedSeats,
    };
  }

  async create(
    movieId: number,
    startTime: Date,
    theaterId: number,
    totalSeats: number,
  ) {
    const movie = await this.em.findOne(Movie, movieId);
    if (!movie || movie.deletedAt) {
      throw new NotFoundException('Movie not found or deleted');
    }

    const screening = this.em.create(Screening, {
      movie,
      startTime,
      theaterId,
      totalSeats,
      reservedSeats: 0,
    });

    await this.em.persistAndFlush(screening);
    return screening;
  }

  async lockScreeningForReservation(screeningId: number) {
    return this.em.findOne(Screening, screeningId, {
      lockMode: LockMode.PESSIMISTIC_WRITE,
    });
  }

  // TODO: implement screening update method
  // TODO: implement screening cancellation
  // TODO: implement bulk screening creation for movie
}
