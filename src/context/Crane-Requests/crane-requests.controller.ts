import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpException, HttpStatus} from '@nestjs/common';
import { UpdateCraneRequestsDto } from './dto/update-crane-requests.dto';
import { CraneRequestsService } from './crane-requests.service';
import { CreateCraneRequestsDto } from './dto/create-crane-requests.dto';

@Controller('services')
export class CraneRequestsController {
  constructor(private readonly servicesService: CraneRequestsService) {}

  @Post()
  async create(@Body() createServiceDto: CreateCraneRequestsDto) {
    try {
      return await this.servicesService.create(createServiceDto);
    } catch (error) {
      console.log('Error controller create a service:', error);
      throw new HttpException('Error creating service', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.servicesService.findAll();
    } catch (error) {
      console.log('Error finding services:', error);
      throw new HttpException('Error finding services', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') _id: string) {
    try {
      const service = await this.servicesService.findOne(_id);
      if (!service) {
        throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
      }
      return service;
    } catch (error) {
      console.log('Error finding service:', error);
      throw new HttpException('Error finding service', HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') _id: string, 
    @Body() updateServiceDto: UpdateCraneRequestsDto
  ) {
    try {
      const { gruaId, driverId, ...rest } = updateServiceDto;
  
      // Verificar si los IDs de grua y conductor son válidos (puedes ajustar la lógica de validación según lo necesario)
      if (gruaId && !this.isValidObjectId(gruaId)) {
        throw new HttpException('Invalid Grua ID', HttpStatus.BAD_REQUEST);
      }
  
      if (driverId && !this.isValidObjectId(driverId)) {
        throw new HttpException('Invalid Driver ID', HttpStatus.BAD_REQUEST);
      }
  
      // Actualizar el servicio
      const updatedService = await this.servicesService.update(_id, {
        gruaId,
        driverId,
        ...rest,
      });
  
      if (!updatedService) {
        throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
      }
  
      return updatedService;
    } catch (error) {
      console.log('Error updating service:', error);
      throw new HttpException('Error updating service', HttpStatus.BAD_REQUEST);
    }
  }
  
  // Método para validar ObjectId
  private isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }
  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
