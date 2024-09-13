import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleIncidentPhotosDto } from './dto/create-vehicle-incident-photos.dto';
import { UpdateVehicleIncidentPhotosDto } from './dto/update-vehicle-incident-photos.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IVehicleIncidentPhoto } from './entities/vehicle-incident-photos.entity';
import { CraneRequestsService } from '../Crane-Requests/crane-requests.service';
@Injectable()
export class VehicleIncidentPhotosService {

  constructor(
    @InjectModel('VehicleIncidentPhoto') private readonly vehicleIncidentPhotoModel: Model<IVehicleIncidentPhoto>,
    private  craneRequestsService: CraneRequestsService
  ) { }
  async create(towingServiceId: string, files: Express.Multer.File[]) {
    // Validar si el ID es un ObjectId válido
    if (!towingServiceId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new HttpException('Invalid Towing Service ID format', HttpStatus.BAD_REQUEST);
    }

    // Buscar el servicio de grúa por su ID
    const towingService = await this.craneRequestsService.findOne(towingServiceId);
    if (!towingService) {
    console.log("los datos del service es knnknlknmlkmlñmñlmñl: ", towingService.vehicleIncidentPhotosId  )

      throw new HttpException('Towing Service not found', HttpStatus.NOT_FOUND);
    }

    if (towingService.vehicleIncidentPhotosId) {
      throw new HttpException('Towing Service already has a vehicleIncidentPhotosId', HttpStatus.BAD_REQUEST);
    }
    

    console.log("los datos del service es: ", Object(towingService.vehicleIncidentPhotosId))
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
    const newPhotoRecord = await this.vehicleIncidentPhotoModel.create({
      urlFrontal: files[0]?.filename,
      urlTrasera: files[1]?.filename,
      urlLateralDerechoCopiloto: files[2]?.filename,
      urlLateralIzquierdoConductor: files[3]?.filename,
    });

    // Actualizar el servicio de grúa con el ID del nuevo conjunto de fotos
    towingService.vehicleIncidentPhotosId = newPhotoRecord._id as any;
    await towingService.save();

    return towingService;  // Devolver el documento actualizado
  }
  
  // create(createTowingPhotoDto: CreateVehicleIncidentPhotosDto) {
  //   return 'This action adds a new towingPhoto';
  // }

  findAll() {
    return `This action returns all towingPhoto`;
  }

  async findOne(id: string): Promise<IVehicleIncidentPhoto> {
    // Validación del ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid ID format');
    }

    const photoRecord = await this.vehicleIncidentPhotoModel.findById(id).exec();
    if (!photoRecord) {
      throw new NotFoundException(`Photos with ID ${id} not found`);
    }
    return photoRecord;
  }

  async update(
    id: string,
    updateVehicleIncidentPhotosDto: UpdateVehicleIncidentPhotosDto
  ): Promise<IVehicleIncidentPhoto> {
    // Validación del ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid ID format');
    }

    const updatedPhotoRecord = await this.vehicleIncidentPhotoModel.findByIdAndUpdate(
      id,
      updateVehicleIncidentPhotosDto,
      { new: true }
    ).exec();

    if (!updatedPhotoRecord) {
      throw new NotFoundException(`Unable to update photos with ID ${id}`);
    }

    return updatedPhotoRecord;
  }
  remove(id: number) {
    return `This action removes a #${id} towingPhoto`;
  }
}
