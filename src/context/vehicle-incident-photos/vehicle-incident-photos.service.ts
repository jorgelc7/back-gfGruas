import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleIncidentPhotosDto } from './dto/create-vehicle-incident-photos.dto';
import { UpdateVehicleIncidentPhotosDto } from './dto/update-vehicle-incident-photos.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IVehicleIncidentPhoto } from './entities/vehicle-incident-photos.entity';
@Injectable()
export class VehicleIncidentPhotosService {

  constructor(
    @InjectModel('VehicleIncidentPhoto') private readonly vehicleIncidentPhotoModel: Model<IVehicleIncidentPhoto>,
  ) { }
  async create(createVehicleIncidentPhotosDto: Partial<IVehicleIncidentPhoto>): Promise<IVehicleIncidentPhoto> {
    const newPhotoRecord = new this.vehicleIncidentPhotoModel(createVehicleIncidentPhotosDto);
    return await newPhotoRecord.save();
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
