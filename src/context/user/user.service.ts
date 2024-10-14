import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUsuario } from './entities/user.entity';
import { IRolUsuario } from '../roles/entities/role.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {

  constructor(
    @InjectModel('Usuario') private readonly usuarioModel: Model<IUsuario>,
    @InjectModel('RolUsuario') private readonly rolModel: Model<IRolUsuario>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<IUsuario> {
    try {
      // Validación: Verificar si el email ya está en uso
      const existingUser = await this.usuarioModel.findOne({ email_usuario: createUserDto.email_usuario });
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }
  
      // Creación del nuevo usuario (conductor)
      const newUser = new this.usuarioModel(createUserDto);
      return await newUser.save();
    } catch (error) {
      console.error('Error al crear conductor:', error.message);
      throw new Error('Error al crear conductor: ' + error.message);
    }
  }
  
  async createCliente(createUserDto: CreateUserDto): Promise<IUsuario> {
    try {
      const existingUser = await this.usuarioModel.findOne({ email_usuario: createUserDto.email_usuario });
      if (existingUser) {
        throw new BadRequestException('El email ya está registrado');
      }
  
      const newUser = new this.usuarioModel(createUserDto);
      return await newUser.save();
    } catch (error) {
      console.error('Error al registrar cliente:', error.message);
      throw error;  // Solo lanza el error una vez
    }
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
    return await this.usuarioModel.findOne({ email_usuario: email }).populate('id_rol').exec();
  }

  async findOne(id: string): Promise<IUsuario> {
    const user = await this.usuarioModel.findById(id).populate('id_rol').exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  async verifyPassword(userId: string, providedPassword: string): Promise<boolean> {
    const user = await this.usuarioModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const isPasswordValid = await bcryptjs.compare(providedPassword, user.clave_usuario); // Suponiendo que usas bcrypt para encriptar contraseñas
    return isPasswordValid;
  }


  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<IUsuario> {
    try {
      const user = await this.usuarioModel.findById(id);
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Hash the new password before saving
      const hashedPassword = await bcryptjs.hash(updatePasswordDto.clave_usuario, 10);
      user.clave_usuario = hashedPassword;
      return await user.save();
    } catch (error) {
      console.error('Error capturado en el servicio:', error.message);
      throw new Error('Error al actualizar la contraseña');
    }
  }


  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUsuario> {
    try {
      console.log("ID:", id);
      console.log("DTO para actualizar:", updateUserDto);

      const updatedUser = await this.usuarioModel.findByIdAndUpdate(
        id,
        { $set: updateUserDto },
        { new: true }
      ).exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      console.log("Usuario actualizado:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Error updating user");
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.usuarioModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}