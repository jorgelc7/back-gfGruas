import { Module } from '@nestjs/common';
import { MapsService } from './google-maps.service';

@Module({
  providers: [MapsService],
  exports: [MapsService], // Exporta el servicio para que otros módulos puedan usarlo
})
export class GoogleMapsModule {}
