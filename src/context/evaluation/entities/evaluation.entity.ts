import { Schema, Document } from 'mongoose';

export interface IEvaluation extends Document {
  rating: number;
  comentario: string;
  createdAt: Date;
}


export const EvaluationSchema = new Schema({
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comentario: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });