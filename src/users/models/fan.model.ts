import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User, UserRole } from './_user.model';
import { Movie } from 'src/movies/models/movie.model';

export type FanDocument = Fan & Document;
export interface IMovieExtended {
  movie: string;
  title: string;
  colour: string;
  genre: string;
  length: string;
}

@Schema()
export class Fan {
  role: UserRole;

  @Prop([
    {
      movie: { type: Types.ObjectId, ref: Movie.name },
      title: { type: String },
      colour: { type: String },
      genre: { type: String },
      length: { type: String },
    },
  ])
  favourites?: IMovieExtended[];
}

const FanSchema = SchemaFactory.createForClass(Fan);

export { FanSchema };
