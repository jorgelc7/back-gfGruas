import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (configService: ConfigService): Promise<typeof mongoose> => {
      const uri = `mongodb://${configService.get('DB_USERNAME')}:${configService.get('DB_PASSWORD')}@${configService.get('DB_HOST')}:${configService.get('DB_PORT')}/${configService.get('DB_NAME')}?authSource=${configService.get('DB_AUTH_SOURCE')}`;

      mongoose.connection.once('open', () => {
        console.log('Conexión a MongoDB establecida correctamente.');
      });

      mongoose.connection.on('error', (err) => {
        console.error('Error de conexión a MongoDB:', err);
      });

      return mongoose.connect(uri);
    },
    inject: [ConfigService],
  },
];
