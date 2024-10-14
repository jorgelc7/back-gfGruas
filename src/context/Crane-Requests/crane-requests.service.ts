import { Injectable, HttpStatus, HttpException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ICraneRequest } from './entities/crane-requests.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCraneRequestsDto } from './dto/create-crane-requests.dto';
import { UpdateCraneRequestsDto } from './dto/update-crane-requests.dto';
import { MapsService } from 'src/google-maps/google-maps.service';
import { HttpService } from '@nestjs/axios';
import { IUsuario } from '../user/entities/user.entity';
import { EstadoCraneRequest } from "../Crane-Requests/entities/crane-requests.entity"
@Injectable()
export class CraneRequestsService {


  constructor(
    @InjectModel('CraneRequest') private readonly servicioModel: Model<ICraneRequest>,
    @InjectModel('Usuario') private readonly usuarioModel: Model<IUsuario>,
    private readonly mapsService: MapsService,
    private readonly httpService: HttpService
  ) { }

  async create(createServiceDto: CreateCraneRequestsDto): Promise<ICraneRequest> {
    try {
      console.log('Incoming data from frontend:', createServiceDto);
      // Crear el DTO con los datos calculados
      const newServiceDto = {
        ...createServiceDto,
      };

      const newService = new this.servicioModel(newServiceDto);
      return await newService.save();
    } catch (error) {
      console.log('Error creating service:', error);
      throw new HttpException('Error creating service', HttpStatus.BAD_REQUEST);
    }
  }


  async getRouteData(startLat: number, startLon: number, endLat: number, endLon: number, userId: string) {
    const osrmUrl = `https://osm.gfgruas.cl/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=false&geometries=geojson`;

    try {
      const { data } = await this.httpService.get(osrmUrl).toPromise();
      if (!data || !data.routes || data.routes.length === 0) {
        throw new InternalServerErrorException('No route data available');
      }

      const route = data.routes[0];
      const leg = route.legs[0];

      // Obtener los nombres de los puntos de inicio y destino
      const [direccionRecogida, direccionEntrega, user] = await Promise.all([
        this.getLocationName(startLat, startLon),
        this.getLocationName(endLat, endLon),
        this.findOneUser(userId) // Obtener usuario por ID
      ]);

      return [{
        direccionRecogida,
        direccionEntrega,
        distancia: this.formatDistance(leg.distance),
        duration: this.formatDuration(leg.duration),
        distanceValue: leg.distance,
        tiempoRutaCliente: this.formatDuration(leg.duration),
        usuario: user // Incluir usuario en la respuesta
      }];

    } catch (error) {
      throw new InternalServerErrorException(`Error fetching route data: ${error.message}`);
    }
  }
  async findOneUser(id: string): Promise<IUsuario> {
    const user = await this.usuarioModel.findById(id).exec();
    console.log("Usuario encontrado:", user);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  private async getLocationName(lat: number, lon: number): Promise<string> {
    const photonUrl = `https://photon.gfgruas.cl/reverse?lat=${lat}&lon=${lon}`;
    try {
      const { data } = await this.httpService.get(photonUrl).toPromise();

      // Extraer el nombre del lugar desde las propiedades
      if (data.features && data.features.length > 0) {
        const properties = data.features[0].properties;
        return `${properties.name}, ${properties.city}, ${properties.state}, ${properties.country}`;
      }

      return 'Unknown location';
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching location name: ${error.message}`);
    }
  }

  private formatDistance(distance: number): string {
    return `${(distance / 1000).toFixed(2)} km`;
  }

  private formatDuration(duration: number): string {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
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
  // Método para obtener las solicitudes activas de un usuario
  async findActiveRequestByUserId(clienteId: string) {
    return await this.servicioModel.findOne({
      clienteId,
      estado: { $nin: [EstadoCraneRequest.CANCELADO, EstadoCraneRequest.CANCELADO] }
    }).exec();
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
