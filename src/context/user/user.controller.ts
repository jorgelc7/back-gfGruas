
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Logger, Res, HttpStatus, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as bcryptjs from 'bcryptjs';

@Controller('user')
export class UserController {

  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      
      console.log('Incoming data from frontend:', createUserDto);
      const createUser = { ...createUserDto, userAt: 'ADMIN', estado_usuario: 1 };
      return this.userService.create(createUser);
    } catch (error) {
      console.log('Incoming data from frontend:', createUserDto);
      
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { filename: file.filename };
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const usuarios = await this.userService.findAll();
      return res.status(HttpStatus.OK).json({
        success: true,
        data: usuarios,
      });
    } catch (error) {
      this.logger.error(`Error al buscar usuarios: ${error.message}`, error.stack);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) { // Cambiado a string
    return this.userService.findOne(id); // No uses +id
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) { // Cambiado a string
    try {
      console.log(updateUserDto);
      const hashedPassword = await bcryptjs.hash(updateUserDto.clave_usuario, 10);
      const updateDtoHashed = { ...updateUserDto, clave_usuario: hashedPassword };
      const usuario = await this.userService.update(id, updateDtoHashed); // No uses +id
      return res.status(HttpStatus.OK).json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      this.logger.error(`Error al actualizar usuarios: ${error.message}`, error.stack);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) { // Cambiado a string
    return this.userService.remove(id); // No uses +id
  }
}






// import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Logger, Res, HttpStatus, Put } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { send } from 'process';
// import { Response } from 'express';
// import * as bcryptjs from 'bcryptjs'

// @Controller('user')
// export class UserController {

//    private readonly logger = new Logger(UserController.name);


//   constructor(private readonly userService: UserService) {}

//   @Post()
//   create(@Body() createUserDto: CreateUserDto) {

//     const createUser = {...createUserDto, userAt: 'ADMIN', estado_usuario: 1}

//     return this.userService.create(createUser);
//   }

//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file'))
//   upload(@UploadedFile() file: Express.Multer.File) {
//     console.log(file);
//     return { filename: file.filename };
//   }

//   @Get()
//   async findAll(@Res() res: Response) {
//     try {
//       const usuarios = await this.userService.findAll();
//       return res.status(HttpStatus.OK).json({
//         success: true,
//         data: usuarios,
//       });
//     } catch (error) {
//       this.logger.error(`Error al buscar usuarios: ${error.message}`, error.stack);
//       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: 'Error interno del servidor',
//       });
//     }
//   }

//   @Get(':id')
//   findOne(@Param('id') id: number) {
//     return this.userService.findOne(+id);
//   }

//   @Put(':id')
//   async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Res() res: Response ) {
//     try {
//         console.log(updateUserDto);
//         const hashedPassword = await bcryptjs.hash(updateUserDto.clave_usuario, 10);
//         const updateDtoHashed = { ...updateUserDto, clave_usuario: hashedPassword };
//         const usuario = await this.userService.update(+id, updateDtoHashed);
//         return res.status(HttpStatus.OK).json({
//           success: true,
//           data: usuario,
//         });
//       } catch (error) {
//         this.logger.error(`Error al actualizar usuarios: ${error.message}`, error.stack);
//         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//           success: false,
//           message: 'Error interno del servidor',
//         });
//       }
//   }

//   @Delete(':id')
//   remove(@Param('id') id: number) {
//     return this.userService.remove(+id);
//   }
// }
