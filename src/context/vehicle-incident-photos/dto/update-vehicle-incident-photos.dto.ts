import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleIncidentPhotosDto } from './create-vehicle-incident-photos.dto';

export class UpdateVehicleIncidentPhotosDto extends PartialType(CreateVehicleIncidentPhotosDto) {}
