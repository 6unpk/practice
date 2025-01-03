import { EntityManager } from '@mikro-orm/core';
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Reservation } from '../entity/reservation.entity';
import { ScreeningService } from './screening.service';

@Injectable()
export class ReservationService {
  constructor(
    private readonly em: EntityManager,
    private readonly screeningService: ScreeningService,
  ) {}

  async createReservation(
    userId: number,
    screeningId: number,
    seatNumber: string,
  ) {
    const em = this.em.fork();

    // 트랜잭션 시작
    await em.begin();

    try {
      // Pessimistic Lock으로 상영 정보 가져오기
      const screening =
        await this.screeningService.lockScreeningForReservation(screeningId);

      if (!screening) {
        throw new NotFoundException('Screening not found');
      }

      // 예매 가능 여부 확인
      if (screening.reservedSeats >= screening.totalSeats) {
        throw new ConflictException('No seats available');
      }

      // 중복 좌석 예매 확인
      const existingReservation = await em.findOne(Reservation, {
        screening: screeningId,
        seatNumber,
      });

      if (existingReservation) {
        throw new ConflictException('Seat already reserved');
      }

      // 예매 정보 생성
      const reservation = em.create(Reservation, {
        user: userId,
        screening,
        seatNumber,
      });

      // 좌석 수 업데이트
      screening.reservedSeats++;

      await em.persistAndFlush([reservation, screening]);
      await em.commit();

      return reservation;
    } catch (error) {
      await em.rollback();
      throw error;
    }
  }

  async findUserReservations(userId: number) {
    return this.em.find(
      Reservation,
      { user: userId },
      {
        populate: ['screening', 'screening.movie'],
        orderBy: { 'screening.startTime': 'DESC' },
      },
    );
  }

  async findUserReservationHistory(
    userId: number,
    type: 'upcoming' | 'past',
    page: number = 1,
    limit: number = 10,
  ) {
    const qb = this.em.createQueryBuilder(Reservation, 'r');
    const now = new Date();

    qb.select(['*'])
      .leftJoin('r.screening', 's')
      .leftJoin('s.movie', 'm')
      .where({ user: userId })
      .orderBy({ 'r.reservedAt': 'DESC' });

    if (type === 'upcoming') {
      qb.andWhere({ 's.startTime': { $gt: now } });
    } else {
      qb.andWhere({ 's.startTime': { $lte: now } });
    }

    const [reservations, total] = await qb
      .limit(limit)
      .offset((page - 1) * limit)
      .getResultAndCount();

    return {
      reservations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getReservationDetail(reservationId: number, userId: number) {
    const reservation = await this.em.findOne(Reservation, reservationId, {
      populate: ['screening', 'screening.movie'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.user.id !== userId) {
      throw new ConflictException('Not authorized to view this reservation');
    }

    const now = new Date();
    const screening = reservation.screening;

    return {
      ...reservation,
      status: screening.startTime > now ? 'upcoming' : 'past',
      canCancel: screening.startTime > now,
    };
  }

  async getReservationStats(userId: number) {
    const qb = this.em.createQueryBuilder(Reservation, 'r');
    const now = new Date();

    const stats = await qb
      .select([
        'COUNT(*) as total',
        `SUM(CASE WHEN s.startTime > '${now.toISOString()}' THEN 1 ELSE 0 END) as upcoming`,
        `SUM(CASE WHEN s.startTime <= '${now.toISOString()}' THEN 1 ELSE 0 END) as past`,
      ])
      .leftJoin('r.screening', 's')
      .where({ user: userId })
      .execute('all');

    return stats[0];
  }

  // TODO: implement reservation cancellation
  // TODO: implement reservation modification
  // TODO: implement reservation history
}
