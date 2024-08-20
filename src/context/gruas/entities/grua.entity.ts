//export class Grua {}

import { Schema, Document, model } from 'mongoose';

export interface IGruas extends Document {
  patente: string;
  marca: string;
  modelo: string;
  year: Date;
  estado: string;
}

export const GruasSchema = new Schema<IGruas>({

  patente: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  marca: {
    type: String,
    required: [true, 'La marca no puede estar vacía'],
    minlength: [2, 'La marca debe tener entre 2 y 50 caracteres.'],
    maxlength: [50, 'La marca debe tener entre 2 y 50 caracteres.'],
  },
  modelo: {
    type: String,
    required: [true, 'El modelo no puede estar vacío'],
    minlength: [2, 'El modelo debe tener entre 2 y 50 caracteres.'],
    maxlength: [50, 'El modelo debe tener entre 2 y 50 caracteres.'],
  },
  year: {
    type: Date,
    required: true,
    min: [1900, 'El año debe ser mayor o igual a 1900'],
    // max: [new Date().getFullYear(), `El año debe ser menor o igual a ${new Date().getFullYear()}`],
  },
  estado: {
    type: String,
    required: true,
    enum: ['ARRIENDO', 'DISPONIBLE', 'MANTENIMIENTO'],
  },
});
