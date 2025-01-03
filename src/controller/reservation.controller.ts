import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReservationService } from '../service/reservation.service';
import { ScreeningService } from '../service/screening.service';

@Controller('reservations')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly screeningService: ScreeningService,
  ) {}

  @Get('screenings')
  async getAvailableScreenings() {
    return this.screeningService.getScreeningsWithAvailability(new Date());
  }

  @Get('screenings/:id/seats')
  async getScreeningSeats(@Param('id') screeningId: number) {
    return this.screeningService.findAvailableSeats(screeningId);
  }

  @Post()
  async createReservation(
    @Body('userId') userId: number,
    @Body('screeningId') screeningId: number,
    @Body('seatNumber') seatNumber: string,
  ) {
    return this.reservationService.createReservation(
      userId,
      screeningId,
      seatNumber,
    );
  }

  @Get('user/:userId')
  async getUserReservations(@Param('userId') userId: number) {
    return this.reservationService.findUserReservations(userId);
  }

  @Get('history/:userId')
  async getReservationHistory(
    @Param('userId') userId: number,
    @Query('type') type: 'upcoming' | 'past' = 'upcoming',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.reservationService.findUserReservationHistory(
      userId,
      type,
      page,
      limit,
    );
  }

  @Get(':id/detail')
  async getReservationDetail(
    @Param('id') reservationId: number,
    @Query('userId') userId: number,
  ) {
    return this.reservationService.getReservationDetail(reservationId, userId);
  }

  @Get('stats/:userId')
  async getReservationStats(@Param('userId') userId: number) {
    return this.reservationService.getReservationStats(userId);
  }

  // TODO: implement reservation cancellation endpoint
  // TODO: implement reservation modification endpoint
  // TODO: implement reservation history endpoint
}