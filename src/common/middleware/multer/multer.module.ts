import {Global, Module } from '@nestjs/common';
import { MulterService } from './multer.middleware';

@Global()
@Module({
  providers: [MulterService],
  exports: [MulterService],
})
export class MulterModule {}
