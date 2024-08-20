import { Module } from '@nestjs/common';
import { VehicleIncidentPhotosController } from './vehicle-incident-photos.controller';
import { VehicleIncidentPhotosService } from './vehicle-incident-photos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { vehicleIncidentPhotosSchema } from './entities/vehicle-incident-photos.entity';
import { CraneRequestsModule } from '../Crane-Requests/crane-requests.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'VehicleIncidentPhoto', schema: vehicleIncidentPhotosSchema }]),
    CraneRequestsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'uploads', 'accidentphotos'), // Ruta completa donde se guardan las imágenes
      serveRoot: '/accidentphotos', // Prefijo para acceder a los archivos
    }),
  ],
  controllers: [VehicleIncidentPhotosController],
  providers: [VehicleIncidentPhotosService],
})
export class VehicleIncidentPhotosModule {}
