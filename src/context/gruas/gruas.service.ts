import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateGruaDto } from './dto/create-grua.dto';
import { UpdateGruaDto } from './dto/update-grua.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IGruas } from './entities/grua.entity';
import { GruasSchema } from './entities/grua.entity';
import { Model } from 'mongoose';

@Injectable()
export class GruasService {

  constructor(@InjectModel('Gruas') private readonly gruasModel: Model<IGruas>) { }


  async create(createGruaDto: CreateGruaDto) {

    try {
      const newGrua = new this.gruasModel(createGruaDto);
      return await newGrua.save();

    } catch (error) {
      console.log("ppppppp", createGruaDto);
      console.log("error create grua service", error);
      throw new HttpException('Error creating service Grua', HttpStatus.BAD_REQUEST);
    }
  }

  
  async findAll(): Promise<IGruas[]> {
    try {
      return await this.gruasModel.find().exec();
    } catch (error) {
      console.log("Error service findAll gruas", error);
      throw new HttpException('Error fetching gruas', HttpStatus.BAD_REQUEST);
    }
  }

 
  async findOne(id: string): Promise<IGruas> {
    try {
      return await this.gruasModel.findById(id).exec();
    } catch (error) {
      console.log("Error service findOne grua", error);
      throw new HttpException('Error fetching grua', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateGruaDto: UpdateGruaDto): Promise<IGruas> {
    try {
      return await this.gruasModel.findByIdAndUpdate(id, updateGruaDto, { new: true }).exec();
    } catch (error) {
      console.log("Error service update grua", error);
      throw new HttpException('Error updating grua', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string): Promise<IGruas> {
    try {
      return await this.gruasModel.findByIdAndDelete(id).exec();
    } catch (error) {
      console.log("Error service remove grua", error);
      throw new HttpException('Error removing grua', HttpStatus.BAD_REQUEST);
    }
  }
}
