import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './context/auth/auth.module';
import { UserModule } from './context/user/user.module';
import { HttpLoggerMiddleware } from './common/utils/logs-config/logs.middleware';
import { RolesModule } from './context/roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggingMiddleware } from './common/middleware/consoleData/consoleData';
import { GruasModule } from './context/gruas/gruas.module';
import { MulterService } from './common/middleware/multer/multer.middleware';
import { MulterModule } from './common/middleware/multer/multer.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CraneRequestsModule } from './context/Crane-Requests/crane-requests.module';
import { VehicleIncidentPhotosModule } from './context/vehicle-incident-photos/vehicle-incident-photos.module';
import { MapsService } from './google-maps/google-maps.service';
import { EvaluationModule } from './context/evaluation/evaluation.module';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=${process.env.DB_AUTH_SOURCE}`),
    RolesModule,
    UserModule,
    AuthModule,
    GruasModule,
    MulterModule,
    EvaluationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'uploads', 'imgPerfil'), // Ruta completa donde se guardan las imágenes
      serveRoot: '/imgPerfil', // Prefijo para acceder a los archivos
    }),
    CraneRequestsModule,
    VehicleIncidentPhotosModule
  ],
  controllers: [AppController],
  providers: [AppService, MapsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*');

    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes('*');
  }
}
