import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  async create(@Body() createEvaluationDto: CreateEvaluationDto) {
    try {
      const evaluation = await this.evaluationService.create(createEvaluationDto);
      return { message: 'Evaluation created successfully', evaluation };
    } catch (error) {
      // Si es una instancia de HttpException, lánzala tal cual
      if (error instanceof HttpException) {
        throw error;
      }
      // Caso contrario, lanza un error genérico
      throw new HttpException('Error creating evaluation', HttpStatus.BAD_REQUEST);
    }
  }
  

  @Get()
  findAll() {
    return this.evaluationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evaluationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEvaluationDto: UpdateEvaluationDto) {
    return this.evaluationService.update(+id, updateEvaluationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evaluationService.remove(+id);
  }
}
