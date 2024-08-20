import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpException, HttpStatus, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { VehicleIncidentPhotosService } from './vehicle-incident-photos.service';
import { CreateVehicleIncidentPhotosDto } from './dto/create-vehicle-incident-photos.dto';
import { UpdateVehicleIncidentPhotosDto } from './dto/update-vehicle-incident-photos.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterService } from 'src/common/middleware/multer/multer.middleware';
import * as fs from 'fs';
import * as path from 'path';
import { CraneRequestsService } from '../Crane-Requests/crane-requests.service';
@Controller('vehicle-incident-photos')
export class VehicleIncidentPhotosController {
  constructor(private readonly vehicleIncidentPhotosService: VehicleIncidentPhotosService, private  craneRequestsService: CraneRequestsService) {}


  @Post()
  create(@Body() createTowingPhotoDto: CreateVehicleIncidentPhotosDto) {
    return this.vehicleIncidentPhotosService.create(createTowingPhotoDto);
  }

  @Get()
  findAll() {
    return this.vehicleIncidentPhotosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.vehicleIncidentPhotosService.findOne(_id);
  }

  @Patch(':towingServiceId')
  @UseInterceptors(FilesInterceptor('photos', 4, new MulterService().getMulterOptions('./src/uploads/accidentphotos')))
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateVehicleIncidentPhotos(
    @Param('towingServiceId') towingServiceId: string, 
    @Body() updateVehicleIncidentPhotosDto: UpdateVehicleIncidentPhotosDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      // Validar si el ID es un ObjectId válido
      if (!towingServiceId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new HttpException('Invalid Towing Service ID format', HttpStatus.BAD_REQUEST);
      }
  
      // Buscar el servicio de grúa por su ID
      const towingService = await this.craneRequestsService.findOne(towingServiceId);
      if (!towingService) {
        throw new HttpException('Towing Service not found', HttpStatus.NOT_FOUND);
      }
  
      // Validar la cantidad y presencia de archivos subidos
      if (!files || files.length < 4) {
        throw new HttpException('All 4 photos are required', HttpStatus.BAD_REQUEST);
      }
  
      // Validar tipos de archivos
      files.forEach(file => {
        if (!file.mimetype.startsWith('image/')) {
          throw new HttpException('Only image files are allowed', HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        }
      });
  
      // Crear un nuevo registro en VehicleIncidentPhotos
      const newPhotoRecord = await this.vehicleIncidentPhotosService.create({
        urlFrontal: files[0]?.filename,
        urlTrasera: files[1]?.filename,
        urlLateralDerechoCopiloto: files[2]?.filename,
        urlLateralIzquierdoConductor: files[3]?.filename,
      });
  
      console.log("New Photo Record ID:", newPhotoRecord._id);
  
      // Actualizar el servicio de grúa con el ID del nuevo conjunto de fotos
      towingService.vehicleIncidentPhotosId = newPhotoRecord._id as any;
      await towingService.save();  // Guardar los cambios en TowingServices
  
      return towingService;  // Devolver el documento actualizado
  
    } catch (error) {
      console.log('Error updating vehicle incident photos:', error);
      
      // Manejo detallado de errores
      if (error instanceof HttpException) {
        throw error;  // Lanza la excepción HTTP personalizada
      } else {
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  
  
  
  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleIncidentPhotosService.remove(+id);
  }
}
