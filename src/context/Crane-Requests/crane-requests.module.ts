import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CraneRequestSchema } from './entities/crane-requests.entity';
import { CraneRequestsService } from './crane-requests.service';
import { CraneRequestsController } from './crane-requests.controller';
import { GoogleMapsModule } from 'src/google-maps/google-maps.module';
import { HttpModule } from '@nestjs/axios';
import { UsuarioSchema } from '../user/entities/user.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'CraneRequest', schema: CraneRequestSchema,  }
      ,{ name: 'Usuario', schema: UsuarioSchema },
    ]),  // El nombre 'Att' debe coincidir
    GoogleMapsModule,
    HttpModule,
  
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','..','..','public'), // Ruta completa donde se guardan las imágenes
      serveRoot: '/public', // Prefijo para acceder a los archivos
    }),

  ],
  controllers: [CraneRequestsController],
  providers: [CraneRequestsService], 
  exports: [CraneRequestsService]
})
export class CraneRequestsModule {}
