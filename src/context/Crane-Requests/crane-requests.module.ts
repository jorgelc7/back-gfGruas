import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CraneRequestSchema } from './entities/crane-requests.entity';
import { CraneRequestsService } from './crane-requests.service';
import { CraneRequestsController } from './crane-requests.controller';
import { GoogleMapsModule } from 'src/google-maps/google-maps.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'CraneRequest', schema: CraneRequestSchema }]),  // El nombre 'Att' debe coincidir
    GoogleMapsModule
  ],
  controllers: [CraneRequestsController],
  providers: [CraneRequestsService],
  exports: [CraneRequestsService]
})
export class CraneRequestsModule {}
