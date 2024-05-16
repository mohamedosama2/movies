import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

export interface IRankingByDate {
  rank: number;
  year: number;
  month: number;
  day: number;
}

@Schema({
  timestamps: true,
})
export class Movie {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  director: string;

  @Prop({ type: String, required: true })
  year: string;

  @Prop({ type: String, required: true })
  country: string;

  @Prop({ type: Number, required: true })
  length: number;

  @Prop({ type: String, required: true, index: 1 })
  genre: string;

  @Prop({ type: String, required: true })
  colour: string;

  @Prop([
    {
      rank: { type: Number, required: true },
      year: { type: Number, required: true },
      month: { type: Number, required: true },
      day: { type: Number, required: true },
    },
  ])
  rankingByYear: IRankingByDate[];

  @Prop({ type: Number, default: 5 })
  rating?: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
