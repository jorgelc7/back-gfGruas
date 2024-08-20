import { Injectable, HttpStatus, HttpException, NotFoundException } from '@nestjs/common';
import { ITowingServices } from './entities/crane-requests.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {CreateCraneRequestsDto } from './dto/create-crane-requests.dto';
import { UpdateCraneRequestsDto } from './dto/update-crane-requests.dto';
@Injectable()
export class CraneRequestsService {
 

  constructor( 
    @InjectModel('TowingServices') private readonly servicioModel: Model<ITowingServices>,
  ) {}

  async create(createServiceDto: CreateCraneRequestsDto): Promise<ITowingServices> {
    try {
      const newService = new this.servicioModel(createServiceDto);
      return await newService.save();
    } catch (error) {
      console.log('Error creating service:', error);
      throw new HttpException('Error creating service', HttpStatus.BAD_REQUEST);
    }
  }
  async findAll(): Promise<ITowingServices[]> {
    try {
      return await this.servicioModel.find().exec();
    } catch (error) {
      console.log('Error finding services:', error);
      throw new HttpException('Error finding services', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<ITowingServices> {
    try {
      const service = await this.servicioModel.findById(id).exec();
      if (!service) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }
      return service;
    } catch (error) {
      console.log('Error finding service:', error);
      throw new HttpException('Error finding service', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateServiceDto: UpdateCraneRequestsDto): Promise<ITowingServices> {
    try {
      // Realizar la actualización en la base de datos
      const updatedService = await this.servicioModel.findByIdAndUpdate(
        id,
        updateServiceDto,
        {
          new: true,
          runValidators: true,
        }
      ).exec();
  
      // Verificar si el servicio fue encontrado y actualizado
      if (!updatedService) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }
  
      return updatedService;
    } catch (error) {
      // Log detallado del error
      console.error('Error updating service:', error.message);
  
      // Si es un error de MongoDB, lo manejamos de forma específica
      if (error.name === 'CastError') {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }
  
      throw new HttpException('Error updating service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
