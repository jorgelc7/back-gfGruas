import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpException, HttpStatus, Query } from '@nestjs/common';
import { UpdateCraneRequestsDto } from './dto/update-crane-requests.dto';
import { CraneRequestsService } from './crane-requests.service';
import { CreateCraneRequestsDto } from './dto/create-crane-requests.dto';
import { GoogleMapsService } from 'src/google-maps/google-maps.service';

@Controller('crane-requests')
export class CraneRequestsController {
  constructor(private readonly servicesService: CraneRequestsService,
    private readonly googleMapsService: GoogleMapsService) { }

  @Post()

  async create(@Body() createServiceDto: CreateCraneRequestsDto) {
    try {
      console.log('Incoming data from frontend:', createServiceDto);
      return await this.servicesService.create(createServiceDto);
    } catch (error) {
      console.log('Error controller create a service:', error);
      throw new HttpException('Error creating service', HttpStatus.BAD_REQUEST);
    }
  }
  @Get('directions')
  async getDirections(
    @Query('originLat') originLat: string,
    @Query('originLng') originLng: string,
    @Query('destinationLat') destinationLat: string,
    @Query('destinationLng') destinationLng: string,
  ) {
    const origin = `${originLat},${originLng}`;
    const destination = `${destinationLat},${destinationLng}`;

    // Obtener direcciones y distancia
    const directionsData = await this.googleMapsService.getDirections(origin, destination);

    // Obtener direcciones legibles (nombres de calles)
    const originAddress = await this.googleMapsService.getReverseGeocode(originLat, originLng);
    const destinationAddress = await this.googleMapsService.getReverseGeocode(destinationLat, destinationLng);

    const route = directionsData.routes[0];
    const distanceText = route.legs[0].distance.text;
    const durationText = route.legs[0].duration.text;
    const distanceValue = route.legs[0].distance.value;
    const durationValue = route.legs[0].duration.value;

    const cost = this.calculateCost(distanceValue, durationValue);

    return {
      origin: originAddress,
      destination: destinationAddress,
      distance: distanceText,
      duration: durationText,
      cost,
      route: route.overview_polyline.points,
    };
  }


  // Ejemplo de cálculo de costo basado en distancia y tiempo
  private calculateCost(distance: number, duration: number): number {
    const baseRate = 50; // Tarifa base en tu moneda
    const distanceRate = 500; // Tarifa por km
    const timeRate = 0.5; // Tarifa por minuto

    const cost = baseRate + (distance / 1000) * distanceRate + (duration / 60) * timeRate;
    return Math.round(cost * 100) / 100; // Redondear a 2 decimales
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
        throw new HttpException('No active service found for this driver', HttpStatus.NOT_FOUND);
      }

      // Retornar el estado y las coordenadas
      const response = {
        id: service._id,
        estado: service.estado,
        coordenadas: (service.estado === 'EN_CURSO' || service.estado === 'EN_LUGAR')
          ? service.coordenadasInicio
          : service.coordenadasDestino,

        fechaInicio: service.fechaInicio,
        fechaFin: service.fechaFin,
        driverLlegoRecogerVehiculo: service.driverLlegoRecogerVehiculo,
        driverCompletoServicio: service.driverCompletoServicio,
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
