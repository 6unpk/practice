import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Movie } from '../entity/movie.entity';

@Injectable()
export class MovieService {
  constructor(private readonly em: EntityManager) {}

  async findAll(includeDeleted: boolean = false) {
    const qb = this.em.createQueryBuilder(Movie);

    if (!includeDeleted) {
      qb.where({ deletedAt: null });
    }

    return qb.select('*').orderBy({ createdAt: 'DESC' });
  }

  async findOne(id: number) {
    return this.em.findOne(Movie, id);
  }

  async create(title: string, genre: string, duration: number) {
    const movie = this.em.create(Movie, {
      title,
      genre,
      duration,
    });

    await this.em.persistAndFlush(movie);
    return movie;
  }

  async softDelete(id: number) {
    const movie = await this.em.findOne(Movie, id);
    if (!movie) {
      throw new Error('Movie not found');
    }

    movie.deletedAt = new Date();
    await this.em.flush();
    return movie;
  }

  // TODO: implement update method
  // TODO: implement hard delete method for admin
  // TODO: implement search by genre
}
