import { Schema, Document } from 'mongoose';

export interface IRolUsuario extends Document {
  nombre: string;
  descripcion: string;
  estado: boolean;
  userAt: string;
  usuarios: Schema.Types.ObjectId[];
}

export const RolUsuarioSchema = new Schema<IRolUsuario>({
  nombre: {
    type: String,
    required: [true, 'El nombre no puede estar vacío'],
    minlength: [3, 'Nombre de usuario debe tener entre 3 y 50 caracteres.'],
    maxlength: [50, 'Nombre de usuario debe tener entre 3 y 50 caracteres.'],
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción no puede estar vacía'],
    minlength: [15, 'La descripción debe tener mínimo 15 caracteres y máximo 50.'],
    maxlength: [50, 'La descripción debe tener máximo 50 caracteres.'],
  },
  estado: {
    type: Boolean,
    required: [true, 'El estado es requerido'],
  },
  userAt: {
    type: String,
    required: false,
  },
});

