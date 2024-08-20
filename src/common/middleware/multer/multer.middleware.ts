import { Injectable, BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class MulterService {
  getMulterOptions(destinationPath: string) {
    return {
      storage: diskStorage({
        destination: destinationPath,
        filename: (req, file, cb) => {
          const fileExtName = path.extname(file.originalname).toLowerCase();
          const timestamp = new Date().toISOString()
    .replace(/T/, '-')  // Reemplaza la T con un guion
    .replace(/:/g, '')  // Elimina los dos puntos
    .replace(/\..+/, '') // Elimina la parte de los milisegundos
    .replace(/-/g, '-')  // Asegura que los guiones se mantengan
    .slice(0, 16);       // Mantiene año-mes-día-hora-minuto

const fileName = `${timestamp}-${uuidv4()}${fileExtName}`;



          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        const fileExtName = path.extname(file.originalname).toLowerCase();

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(new BadRequestException('Tipo de archivo no permitido. Solo se aceptan imágenes (jpeg, jpg, png, gif).'), false);
        }

        if (!['.jpeg', '.jpg', '.png', '.gif'].includes(fileExtName)) {
          return cb(new BadRequestException('Extensión de archivo no permitida. Solo se aceptan imágenes (jpeg, jpg, png, gif).'), false);
        }

        cb(null, true);
      }
    };
  }
}
