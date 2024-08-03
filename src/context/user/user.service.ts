import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUsuario } from './entities/user.entity';
import { IRolUsuario } from '../roles/entities/role.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectModel('Usuario') private readonly usuarioModel: Model<IUsuario>,
    @InjectModel('RolUsuario') private readonly rolModel: Model<IRolUsuario>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUsuario> {
    const newUser = new this.usuarioModel(createUserDto);
    return await newUser.save();
  }

  async findAll(): Promise<IUsuario[]> {
    try {
      return await this.usuarioModel.find().populate({
        path: 'id_rol',
        select: '_id nombre'
      }).exec();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Error fetching users');
    }
  }
  

  async findOneByEmail(email: string): Promise<IUsuario> {
    return await this.usuarioModel.findOne({ email_usuario: email }).exec();
  }

  async findOne(id: string): Promise<IUsuario> {
    const user = await this.usuarioModel.findById(id).populate('rol').exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUsuario> {
    const updatedUser = await this.usuarioModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.usuarioModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}


// import { Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { Usuario } from './entities/user.entity';
// import { InjectModel } from '@nestjs/sequelize';
// import { RolUsuario } from '../roles/entities/role.entity';

// @Injectable()
// export class UserService {

//   constructor(
//     @InjectModel(Usuario) private usuarioModel: typeof Usuario,
//     @InjectModel(RolUsuario) private rolModel: typeof RolUsuario
//   ) {}

//   create(createUserDto: CreateUserDto) {
//     return this.usuarioModel.create(createUserDto);
//   }

//   async findAll() {
//     return await this.usuarioModel.findAll(
//       { include: [
//           { model: this.rolModel },
//         ]
//       });
//   }

//   async findOneByEmail(email: string) {
//     return await this.usuarioModel.findOne(
//       { where: { email_usuario: email }});
//   }

//   async findOne(id: number) {
//     return await this.usuarioModel.findOne(
//       { where: { id: id },
//         include: [
//           { model: this.rolModel },
//         ] 
//       });
//   }

//   update(id: number, updateUserDto: UpdateUserDto) {
//     return this.usuarioModel.update(updateUserDto, { where: { id: id } });
//   }

//   remove(id: number) {
//     return this.usuarioModel.destroy({ where: { id: id } });
//   }
// }
