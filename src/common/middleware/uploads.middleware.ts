// import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
// import { Request, Response } from 'express';
// import * as multer from 'multer';
// import * as path from 'path';
// import * as fs from 'fs';

// @Injectable()
// export class FileUploadMiddleware implements NestMiddleware {
//     private storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//         console.log("storddmddge")
//       let uploadFolder = path.resolve(__dirname, '../../../uploads');
      
//       // Verifica el tipo de la solicitud para determinar la carpeta de destino
//       if (req.body.tipo === 'boletas') {
//         uploadFolder = path.resolve(__dirname, '../../../uploads/boletas'); 
//       } else if (req.body.tipo === 'facturas') {
//         uploadFolder = path.resolve(__dirname, '../../../uploads/facturas');
//       }
      
//       // Verifica si la carpeta de destino existe, y si no, la crea
//       if (!fs.existsSync(uploadFolder)) {
//         try {
//           fs.mkdirSync(uploadFolder, { recursive: true });
//         } catch (error) {
//           throw new HttpException(`Failed to create upload folder: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
//         }
//       }
      
//       cb(null, uploadFolder);
//     },
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     },
//   });

//   private upload = multer({ storage: this.storage });

//   use(req: Request, res: Response, next: () => void) {
//     this.upload.single('file')(req, res, next);
//   } 
// }
