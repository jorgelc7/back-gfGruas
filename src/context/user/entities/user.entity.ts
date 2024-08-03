import { Schema, Document, model } from 'mongoose';
import { IRolUsuario } from 'src/context/roles/entities/role.entity'; // Asegúrate de que esta ruta sea correcta

export interface IUsuario extends Document {
  estado_usuario: number;
  nombre_usuario: string;
  email_usuario: string;
  clave_usuario: string;
  id_rol: Schema.Types.ObjectId;
}

export const UsuarioSchema = new Schema<IUsuario>({
  estado_usuario: {
    type: Number,
    required: true,
    default: 1,
  },
  nombre_usuario: {
    type: String,
    required: [true, 'El nombre no puede estar vacío'],
    minlength: [3, 'Nombre de usuario debe tener entre 3 y 50 caracteres.'],
    maxlength: [50, 'Nombre de usuario debe tener entre 3 y 50 caracteres.'],
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
  id_rol: {
    type: Schema.Types.ObjectId,
    ref: 'RolUsuario',
    required: true,
  },
});



// import { Column, DataType, Model, Table, BelongsTo, ForeignKey,HasMany } from 'sequelize-typescript';
// import { RolUsuario } from 'src/context/roles/entities/role.entity';

// @Table
// export class Usuario extends Model<Usuario> {
//   @Column({
//     type: DataType.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   })
//   id: number;

//   @Column({
//     type: DataType.INTEGER,
//     allowNull: false,
//     defaultValue: 1,
//   })
//   estado_usuario: number;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//     validate: {
//       len: { args: [3, 50], msg: 'Nombre de usuario debe tener entre 3 y 50 caracteres.' },
//       notEmpty: { msg: 'El nombre no puede estar vacío' },
//     },
//   })
//   nombre_usuario: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//     unique: true,
//     validate: {
//       len: { args: [15, 50], msg: 'El email debe tener mínimo 15 caracteres y máximo 50.' },
//       isEmail: { msg: 'El email no es válido' },
//     },
//   })
//   email_usuario: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//     validate: {
//       len: { args: [6, 100], msg: 'La contraseña debe tener mínimo 6 caracteres y máximo 50.' },
//       notEmpty: { msg: 'La contraseña no puede estar vacía' },
//       notNull: { msg: 'La contraseña no puede estar vacía' },
//     },
//   })
//   clave_usuario: string;

//   @ForeignKey(() => RolUsuario)
//   @Column
//   id_rol: number;

//   @BelongsTo(() => RolUsuario)
//   rol: RolUsuario;
// }
