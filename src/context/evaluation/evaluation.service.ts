import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEvaluation } from './entities/evaluation.entity';

@Injectable()
export class EvaluationService {

  constructor(
    @InjectModel('Evaluation') private readonly evaluationModel: Model<IEvaluation>,
    @InjectModel('CraneRequest') private readonly craneRequestModel: Model<any>,  // Modelo de arriendo
  ) { }
  async create(createEvaluationDto: CreateEvaluationDto): Promise<IEvaluation> {
    const { rating, comentario, arriendoId } = createEvaluationDto;
  
    try {
      // Verificar que el arriendo exista
      const arriendo = await this.craneRequestModel.findById(arriendoId);
      if (!arriendo) {
        throw new HttpException('Arriendo not found', HttpStatus.NOT_FOUND);
      }
  
      // Verificar si ya existe una evaluación
      if (arriendo.evaluationId) {
        console.log('Ya existe una evaluación para este arriendo');
        throw new HttpException('Este arriendo ya tiene una evaluación', HttpStatus.CONFLICT);
      }
  
      // Crear la evaluación
      const evaluation = new this.evaluationModel({
        rating,
        comentario,
      });
  
      const savedEvaluation = await evaluation.save();
  
      // Actualizar arriendo con el ID de la evaluación
      arriendo.evaluationId = savedEvaluation._id;
      await arriendo.save();
  
      return savedEvaluation;
    } catch (error) {
      // Si el error es una HttpException, lanzarlo tal cual
      if (error instanceof HttpException) {
        throw error;
      }
      // Si no es una HttpException, lanzar un error genérico
      throw new HttpException('Failed to create evaluation', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  findAll() {
    return `This action returns all evaluation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} evaluation`;
  }

  update(id: number, updateEvaluationDto: UpdateEvaluationDto) {
    return `This action updates a #${id} evaluation`;
  }

  remove(id: number) {
    return `This action removes a #${id} evaluation`;
  }
}
