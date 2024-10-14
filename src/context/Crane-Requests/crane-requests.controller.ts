import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpException, HttpStatus, Query, BadRequestException } from '@nestjs/common';
import { UpdateCraneRequestsDto } from './dto/update-crane-requests.dto';
import { CraneRequestsService } from './crane-requests.service';
import { CreateCraneRequestsDto } from './dto/create-crane-requests.dto';
import { MapsService } from 'src/google-maps/google-maps.service';
import { HttpService } from '@nestjs/axios';
import { ParseFloatPipe } from '@nestjs/common';
@Controller('crane-requests')
export class CraneRequestsController {
  constructor(private readonly servicesService: CraneRequestsService,
    private readonly mapsService: MapsService,
    private readonly httpService: HttpService,) { }

  @Post()

  async create(@Body() createServiceDto: CreateCraneRequestsDto,
  ) {
    try {
      console.log('Incoming data from frontend:', createServiceDto);
      return await this.servicesService.create(createServiceDto);
    } catch (error) {
      console.log('Error controller create a service:', error);
      throw new HttpException('Error creating service', HttpStatus.BAD_REQUEST);
    }
  }
  @Get('route')
  async getRoute(
    @Query('startLat', ParseFloatPipe) startLat: number,
    @Query('startLon', ParseFloatPipe) startLon: number,
    @Query('endLat', ParseFloatPipe) endLat: number,
    @Query('endLon', ParseFloatPipe) endLon: number,
    @Query('userId') userId: string
  ) {
    if (!this.validateCoordinates(startLat, startLon, endLat, endLon)) {
      throw new BadRequestException('Invalid coordinates');
    }
    console.log("dklddldmd", userId)
    const routeData = await this.servicesService.getRouteData(startLat, startLon, endLat, endLon, userId);
    return routeData;
  }

  private validateCoordinates(...coords: number[]): boolean {
    return coords.every(coord => coord >= -90 && coord <= 90);
  }


  @Get('reverse-geocode')
  async getReverseGeocode(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
  ) {
    if (!lat || !lon) {
      throw new HttpException('Lat and Lon are required', HttpStatus.BAD_REQUEST);
    }

    try {
      const address = await this.mapsService.reverseGeocode(parseFloat(lat), parseFloat(lon));
      return {
        address,
      };
    } catch (error) {
      throw new HttpException('Error fetching address', HttpStatus.INTERNAL_SERVER_ERROR);
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

  @Get('active/:driverId')
  async findActiveServiceByDriver(@Param('driverId') driverId: string) {
    try {
      // Validar si el ID es un MongoDB ObjectId válido
      if (!driverId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new HttpException('Invalid driver ID', HttpStatus.BAD_REQUEST);
      }

      const service = await this.servicesService.findActiveServiceByDriver(driverId);

      if (!service) {
        throw new HttpException('No active service found for this driver', HttpStatus.NOT_FOUND);
      }

      return service;
    } catch (error) {
      console.error('Error finding active service:', error.message);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR); 
    }
  }

  @Get('activeClient/:clienteId')
  async findActiveServiceByUser(@Param('clienteId') clienteId: string) {
    console.log("dklddldmd", clienteId)
    try {
      // Validar si el ID es un MongoDB ObjectId válido
      if (!clienteId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new HttpException('Invalid cliente ID', HttpStatus.BAD_REQUEST);
      }

      const service = await this.servicesService.findActiveRequestByUserId(clienteId);

      if (!service) {
        return null; 
        //throw new HttpException('No active service found for this user', HttpStatus.NOT_FOUND);
      }

      return service;
    } catch (error) {
      console.error('Error finding active service:', error.message);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('coordinates/:driverId')
  async getServiceCoordinates(@Param('driverId') driverId: string) {
    try {
      if (!driverId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new HttpException('Invalid driver ID', HttpStatus.BAD_REQUEST);
      }

      const coordinates = await this.servicesService.findServiceCoordinatesByDriver(driverId);
      return coordinates;
    } catch (error) {
      console.error('Error finding coordinates:', error.message);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
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


  @Get('details/:driverId')
  async getServiceDetails(@Param('driverId') driverId: string) {
    try {
      // Validación del ID
      if (!driverId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new HttpException('Invalid driver ID', HttpStatus.BAD_REQUEST);
      }

      // Obtener detalles del servicio activo
      const service = await this.servicesService.findServiceDetails(driverId);

      if (!service) {
        console.log("No active service found for driver:", driverId, service);
        return { message: 'No active service', service: null };

        //throw new HttpException('No active service found for this driver', HttpStatus.NOT_FOUND);
      }
      // Retornar el estado y las coordenadas
      const response = {
        _id: service._id,
        estado: service.estado,
        coordenadas: (service.estado === 'EN_CURSO' || service.estado === 'EN_LUGAR' || service.estado === 'PENDIENTE')
          ? service.coordenadasInicio
          : service.coordenadasDestino,

        fechaInicio: service.fechaInicio,
        fechaFin: service.fechaFin,
        driverLlegoRecogerVehiculo: service.driverLlegoRecogerVehiculo,
        driverCompletoServicio: service.driverCompletoServicio,
        driverId: service.driverId,
        vehicleIncidentPhotosId: service.vehicleIncidentPhotosId,
      };

      return response;
    } catch (error) {
      console.error('Error fetching service details:', error.message);
      throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Patch(':id')
  async update(
    @Param('id') _id: string,
    @Body() updateServiceDto: UpdateCraneRequestsDto
  ) {
    try {
      console.log("algo esta muy mal")
      const { gruaId, driverId, ...rest } = updateServiceDto;

      // Verificar si los IDs de grua y conductor son válidos (puedes ajustar la lógica de validación según lo necesario)
      if (gruaId && !this.isValidObjectId(gruaId)) {
        throw new HttpException('Invalid Grua ID', HttpStatus.BAD_REQUEST);
      }

      if (driverId && !this.isValidObjectId(driverId)) {
        throw new HttpException('Invalid Driver ID', HttpStatus.BAD_REQUEST);
      }

      // Actualizar el servicio
      // const updatedService = await this.servicesService.update(_id, {
      //   gruaId,
      //   driverId,
      //   ...rest,
      // });

      // if (!updatedService) {
      //   throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
      // }

      // return updatedService;
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
