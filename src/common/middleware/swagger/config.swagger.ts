import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Contabilidad API')
  .setDescription('Backend contabilidad')
  .setVersion('1.0')
  .addTag('contabilidad')
  .build();
