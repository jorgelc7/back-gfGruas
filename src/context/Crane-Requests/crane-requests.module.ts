import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TowingServicesSchema } from './entities/crane-requests.entity';
import { CraneRequestsService } from './crane-requests.service';
import { CraneRequestsController } from './crane-requests.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'TowingServices', schema: TowingServicesSchema }])  // El nombre 'Att' debe coincidir
  ],
  controllers: [CraneRequestsController],
  providers: [CraneRequestsService],
  exports: [CraneRequestsService]
})
export class CraneRequestsModule {}
