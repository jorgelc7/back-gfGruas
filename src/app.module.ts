import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
 import { AuthModule } from './context/auth/auth.module';
 import { UserModule } from './context/user/user.module';
import { HttpLoggerMiddleware } from './common/utils/logs-config/logs.middleware';
 import { RolesModule } from './context/roles/roles.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { FileUploadMiddleware } from './common/middleware/uploads.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseProviders } from './config/database.provider';
import { LoggingMiddleware } from './common/middleware/consoleData/consoleData';
import { GruasModule } from './context/gruas/gruas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=${process.env.DB_AUTH_SOURCE}`),
    RolesModule,
    UserModule,
    AuthModule,
    GruasModule
  ],
  controllers: [AppController],
  providers: [AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware)
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
    consumer.apply(FileUploadMiddleware).forRoutes('upload');

  }

}