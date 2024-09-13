import { Injectable, HttpStatus, HttpException, NotFoundException } from '@nestjs/common';
import { ICraneRequest } from './entities/crane-requests.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCraneRequestsDto } from './dto/create-crane-requests.dto';
import { UpdateCraneRequestsDto } from './dto/update-crane-requests.dto';
import { GoogleMapsService } from 'src/google-maps/google-maps.service';

@Injectable()
export class CraneRequestsService {


  constructor(
    @InjectModel('CraneRequest') private readonly servicioModel: Model<ICraneRequest>,
    private readonly googleMapsService: GoogleMapsService
  ) { }

  async create(createServiceDto: CreateCraneRequestsDto): Promise<ICraneRequest> {
    try {
      // Obtener direcciones y distancia
      const origin = `${createServiceDto.coordenadasInicio.latitud},${createServiceDto.coordenadasInicio.longitud}`;
      const destination = `${createServiceDto.coordenadasDestino.latitud},${createServiceDto.coordenadasDestino.longitud}`;

      // Obtener direcciones y distancia
      const directionsData = await this.googleMapsService.getDirections(origin, destination);
      const route = directionsData.routes[0];
      const distanceText = route.legs[0].distance.text;
      const durationText = route.legs[0].duration.text;

      // Obtener direcciones legibles
      const originAddress = await this.googleMapsService.getReverseGeocode(createServiceDto.coordenadasInicio.latitud.toString(), createServiceDto.coordenadasInicio.longitud.toString());
      const destinationAddress = await this.googleMapsService.getReverseGeocode(createServiceDto.coordenadasDestino.latitud.toString(), createServiceDto.coordenadasDestino.longitud.toString());

      // Crear el DTO con los datos calculados
      const newServiceDto = {
        ...createServiceDto,
        distancia: distanceText,
        tiempoLlegada: durationText,
        direccionRecogida: originAddress,
        direccionEntrega: destinationAddress,
      };

      const newService = new this.servicioModel(newServiceDto);
      return await newService.save();
    } catch (error) {
      console.log('Error creating service:', error);
      throw new HttpException('Error creating service', HttpStatus.BAD_REQUEST);
    }
  }


  private calculateCost(distanceValue: number, durationValue: number): number {
    // Ejemplo simple de cálculo de costo
    const costPerKm = 1; // Ejemplo de costo por kilómetro
    const costPerMinute = 0.1; // Ejemplo de costo por minuto

    const distanceInKm = distanceValue / 1000;
    const durationInMinutes = durationValue / 60;

    return (distanceInKm * costPerKm) + (durationInMinutes * costPerMinute);
  }

  async findAll(): Promise<ICraneRequest[]> {
    try {
      return await this.servicioModel.find().populate('clienteId').exec();
    } catch (error) {
      console.log('Error finding services:', error);
      throw new HttpException('Error finding services', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findActiveServiceByDriver(driverId: string) {
    try {
      // Buscar servicio no completado para el conductor
      const activeService = await this.servicioModel.findOne({
        driverId,
        estado: { $nin: ['COMPLETADO', 'CANCELADO'] }
      }).exec();

      return activeService;
    } catch (error) {
      console.error('Error querying database:', error.message);
      throw new HttpException('Error fetching service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findServiceCoordinatesByDriver(driverId: string): Promise<{ latitud: number, longitud: number }> {
    try {
      // Buscar servicio activo por driverId y estado
      const service = await this.servicioModel.findOne({
        driverId,
        estado: { $in: ['EN_LUGAR', 'EN_CURSO', 'CON_CLIENTE_EN_CAMINO'] },
      });

      // Verificar si se encontró un servicio
      if (!service) {
        console.error('No active service found for driver:', driverId);
        throw new Error('No active service found for this driver');
      }

      // Retorna las coordenadas según el estado del servicio
      switch (service.estado) {
        case 'EN_CURSO':
        case 'EN_LUGAR':
          console.log('Coordenadas de inicio:', service.coordenadasInicio);
          return service.coordenadasInicio;
        case 'CON_CLIENTE_EN_CAMINO':
          return service.coordenadasDestino;
        default:
          throw new Error('Invalid service state for coordinates');
      }
    } catch (error) {
      console.error('Error finding service coordinates:', error.message);
      throw new Error('Failed to retrieve service coordinates');
    }
  }

  // services.service.ts
  async findServiceDetails(driverId: string) {
    return await this.servicioModel.findOne({
      driverId,
      // estado: { $nin: ['COMPLETADO', 'CANCELADO'] }
    }).exec();
  }

  async findOne(id: string): Promise<ICraneRequest> {
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

  async update(id: string, updateServiceDto: UpdateCraneRequestsDto): Promise<ICraneRequest> {
    try {
      // Desestructuramos el estado para evaluar los cambios
      const { estado, ...rest } = updateServiceDto;
      const updateData = { ...rest };
      // Agregar la fecha actual según el estado correspondiente
      if (estado === 'EN_CURSO') {
        updateData['driverComenzoViaje'] = new Date();
      } else if (estado === 'EN_LUGAR') {
        updateData['driverLlegoRecogerVehiculo'] = new Date();
      } else if (estado === 'COMPLETADO') {
        updateData['driverCompletoServicio'] = new Date();
      }
      
      console.log("kk", rest, "1el estadoes: ", estado)
      // Actualizar el servicio en la base de datos
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
      console.error('Error updating service:', error.message);

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
