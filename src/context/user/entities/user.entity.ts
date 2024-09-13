import { Schema, Document, model } from 'mongoose';
import { IRolUsuario } from 'src/context/roles/entities/role.entity'; // Asegúrate de que esta ruta sea correcta

export interface IUsuario extends Document {
  rut_usuario: String;
  nombre_usuario: string;
  telefono: number;
  email_usuario: string;
  clave_usuario: string;
  estado_usuario: boolean;
  ImgUrl?: string; // Campo agregado para la foto de perfil
  id_rol: Schema.Types.ObjectId;
}

export const UsuarioSchema = new Schema<IUsuario>({
  rut_usuario: {
    type: String,
    required: true,
  },
  nombre_usuario: {
    type: String,
    required: [true, 'El nombre no puede estar vacío'],
    minlength: [3, 'Nombre de usuario debe tener entre 3 y 50 caracteres.'],
    maxlength: [50, 'Nombre de usuario debe tener entre 3 y 50 caracteres.'],
  },
  telefono: {
    type: Number,
    required: true,
  },
  estado_usuario: {
    type: Boolean,
    required: true,
    default: true,
  },
  email_usuario: {
    type: String,
    required: [true, 'El email no puede estar vacío'],
    unique: true,
    minlength: [15, 'El email debe tener mínimo 15 caracteres y máximo 50.'],
    maxlength: [50, 'El email debe tener mínimo 15 caracteres y máximo 50.'],
    validate: {
      validator: function (v: string) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'El email no es válido',
    },
  },
  clave_usuario: {
    type: String,
    required: [true, 'La contraseña no puede estar vacía'],
    minlength: [6, 'La contraseña debe tener mínimo 6 caracteres y máximo 50.'],
    maxlength: [100, 'La contraseña debe tener máximo 100 caracteres.'],
  },
  ImgUrl: {
    type: String,  // Campo para la URL de la imagen de perfil
    required: false,
  },
  id_rol: {
    type: Schema.Types.ObjectId,
    ref: 'RolUsuario',
    required: false,
  },
});
