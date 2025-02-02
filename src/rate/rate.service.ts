import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRepository } from 'src/users/users.repository';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';
import { CreateRateDto } from './dto/create-rate.dto';
import { RateRepository } from './rate.repository';
import { MoviesRepository } from 'src/movies/movies.repository';
import { Movie } from 'src/movies/models/movie.model';

@Injectable()
export class RateService {
  constructor(
    private readonly rateRepository: RateRepository,
    private readonly usersRepositary: UserRepository,
    private readonly MoviesRepository: MoviesRepository,
  ) {}

  async create(
    createRateDto: CreateRateDto,
    subjectType: string,
    id: string,
    userId: string,
  ) {
    let ratedRepository =
      subjectType == 'movies' ? this.MoviesRepository : this.usersRepositary;


    let ratedOne = await ratedRepository.findOne({
      _id: '6643c013fef5d5c1d05538f3',
    });
    if (!ratedOne) throw new NotFoundException();

    let newRate;
    let prevRate = await this.rateRepository.findOne({
      user: userId,
      subjectType,
      subject: ratedOne._id,
    });

    if (prevRate) {
      await prevRate.set(createRateDto).save();
    } else {
      newRate = await this.rateRepository.create({
        ...createRateDto,
        user: userId,
        subject: new Types.ObjectId(ratedOne.id),
        subjectType,
      });
    }

    let rates = await this.rateRepository.fetchRates(ratedOne.id, subjectType);
    ratedOne['rating'] = rates[0]['final'];
    await ratedOne.save();
    let response = prevRate ? prevRate : newRate;

    return response;
  }

  async fetchAllRates(
    paginationParams: PaginationParams,
    subjectType: string,
    id: string,
  ) {
    paginationParams['subjectType'] = subjectType;
    paginationParams['subject'] = new Types.ObjectId(id);
    return await this.rateRepository.findAllWithPaginationOption(
      paginationParams,
      ['subjectType', 'subject'],
      { sort: '-createdAt' },
    );
  }
}
