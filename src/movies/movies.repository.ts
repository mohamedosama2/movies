import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Movie, MovieDocument } from './models/movie.model';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { UserDocument } from 'src/users/models/_user.model';
import { IMovieExtended } from 'src/users/models/fan.model';
@Injectable()
export class MoviesRepository extends BaseAbstractRepository<Movie> {
  constructor(
    @InjectModel(Movie.name)
    private movieModel: Model<MovieDocument>,
  ) {
    super(movieModel);
  }
  async getMyRecommendations(me: UserDocument) {
    return await this.movieModel.aggregate([
      {
        $match: {
          _id: {
            $nin: me['favourites'].map((fav: IMovieExtended) => fav.movie),
          },

          $or: [
            {
              genre: {
                $in: me['favourites'].map((fav: IMovieExtended) => fav.genre),
              },
            },
            {
              length: {
                $in: me['favourites'].map((fav: IMovieExtended) => fav.length),
              },
            },
            {
              colour: {
                $in: me['favourites'].map((fav: IMovieExtended) => fav.colour),
              },
            },
          ],
        },
      },
      {
        $sort: {
          'rankingByYear.rank': 1,
          'rankingByYear.year': -1,
          rating: -1,
        },
      },
     
      { $limit: 15 },
    ]);
  }
  async loadCsvData(): Promise<void> {
    const stream = fs.createReadStream('./src/data/1000GreatestFilms.csv');

    stream
      .pipe(csv())
      .on('data', async (row: any) => {
        // Check if the rank values are numbers, skip if not
        const rank2023 = parseInt(row['2023']);
        const rank2022 = parseInt(row['2022']);
        const rankingByYear = [];

        if (!isNaN(rank2022)) {
          rankingByYear.push({ rank: rank2022, year: 2022, month: 1, day: 1 });
        }
        if (!isNaN(rank2023)) {
          rankingByYear.push({ rank: rank2023, year: 2022, month: 1, day: 1 });
        }

        const movieData = {
          title: row.Title,
          director: row.Director,
          year: row.Year,
          country: row.Country,
          length: row.Length,
          genre: row.Genre,
          colour: row.Colour,
          rankingByYear,
        };

        await this.create(movieData);
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });
  }

  async updateMovie(
    id: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie | null> {
    const existingMovie = await this.movieModel
      .findByIdAndUpdate(id, updateMovieDto, { new: true })
      .exec();

    return existingMovie;
  }
}
