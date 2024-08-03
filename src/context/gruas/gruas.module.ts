import { Module } from '@nestjs/common';
import { GruasService } from './gruas.service';
import { GruasController } from './gruas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GruasSchema } from './entities/grua.entity';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Gruas', schema: GruasSchema }])
  ],
  controllers: [GruasController],
  providers: [GruasService],
})
export class GruasModule {}
