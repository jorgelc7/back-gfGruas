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
  // usuarios: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Usuario',
  // }],
});


// import { Column, DataType, Model, Table, Unique, HasMany } from 'sequelize-typescript';
// import { Usuario } from 'src/context/user/entities/user.entity';

// @Table
// export class RolUsuario extends Model<RolUsuario> {

//   @Column({
//     type: DataType.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   })
//   id: number;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//     validate: {
//       len: { args: [3, 50], msg: 'Nombre de usuario debe tener entre 3 y 50 caracteres.' },
//       notEmpty: { msg: 'El nombre no puede estar vacío' },
//     },
//   })
//   nombre: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//     validate: {
//       len: { args: [15, 50], msg: 'El email debe tener mínimo 15 caracteres y máximo 50.' },
//       isEmail: { msg: 'El email no es válido' },
//     },
//   })
//   descripcion: string;

//   @Column({
//     type: DataType.BOOLEAN,
//     validate: {
//         notEmpty: {
//             msg: "El estado es requerido"
//         }
//     }
//   })
//   estado: boolean;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//   })
//   userAt: string;

//   @HasMany(() => Usuario)
//   usuarios: Usuario[];

// }
