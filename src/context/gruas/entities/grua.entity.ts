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


//   kgCarga: {
//     type: Number,
//     required: true,
//     min: [0, 'La capacidad de carga debe ser un número positivo'],
//   },
//   fechaMantenimiento: {
//     type: Date,
//     required: true,
//   }



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
