import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { swaggerConfig } from 'src/common/middleware/swagger/config.swagger';
import { SwaggerModule } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
mongoose.set('debug', true);



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("gfgruas");

  mongoose.connection.once('open', () => {
    console.log('Conexión a MongoDB establecida correctamente.');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Error de conexión a MongoDB:', err);
  });

  app.enableCors();

  // Mover app.useGlobalPipes antes de app.listen
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
    }),
  );

  await app.listen(process.env.PORT || 3002);

  console.log("esta es: ", process.env.SECRET_PHRASE);

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document); 
  Logger.log(`Server running on port ${process.env.PORT || 3002}`);
}

bootstrap();

