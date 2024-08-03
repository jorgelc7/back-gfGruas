
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRolUsuario } from './entities/role.entity';

@Injectable()
export class RolesService {

  constructor(
    @InjectModel('RolUsuario') private readonly rolUsuarioModel: Model<IRolUsuario>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<IRolUsuario> {
    const newRole = new this.rolUsuarioModel(createRoleDto);
    return await newRole.save();
  }

  async findAll(): Promise<IRolUsuario[]> {
    return await this.rolUsuarioModel.find().exec();
  }

  async findOne(id: string): Promise<IRolUsuario> {
    const role = await this.rolUsuarioModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<IRolUsuario> {
    const updatedRole = await this.rolUsuarioModel.findByIdAndUpdate(id, updateRoleDto, { new: true }).exec();
    if (!updatedRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return updatedRole;
  }

  async remove(id: string): Promise<void> {
    const result = await this.rolUsuarioModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }
}


// import { Injectable } from '@nestjs/common';
// import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';
// import { InjectModel } from '@nestjs/sequelize';
// import { RolUsuario } from './entities/role.entity';

// @Injectable()
// export class RolesService {

//   constructor(
//     @InjectModel(RolUsuario) private usuarioModel: typeof RolUsuario,
//   ) {}

//   create(createRoleDto: CreateRoleDto) {
//     return 'This action adds a new role';
//   }

//   async findAll() {
//     return await this.usuarioModel.findAll();
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} role`;
//   }

//   update(id: number, updateRoleDto: UpdateRoleDto) {
//     return `This action updates a #${id} role`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} role`;
//   }
// }
