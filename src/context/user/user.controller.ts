import { MulterService } from './../../common/middleware/multer/multer.middleware';

import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Logger, Res, HttpStatus, Put, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as bcryptjs from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import { UpdatePasswordDto } from './dto/update-password.dto';
@Controller('user')
export class UserController {

  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {

      console.log('Incoming data from frontend:', createUserDto);
      const createUser = { ...createUserDto, userAt: 'ADMIN'};
      return this.userService.create(createUser);
    } catch (error) {
      console.log('Incoming data from frontend:', createUserDto);

    }
  }
  @Post('register')
  async registerCliente(@Body() createUserDto: CreateUserDto) {
    try {
      // Datos predeterminados para un cliente
      const createUser = { 
        ...createUserDto, 
        id_rol:'66aab46c06f5ffc91bd87ef8' // Coloca el ID correcto del rol de cliente
      };
      return await this.userService.createCliente(createUser);
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      throw error;  // Maneja el error adecuadamente
    }
  }
  
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { filename: file.filename };
  }

  @Post('verify-password/:id')
  async verifyPassword(
    @Param('id') userId: string,
    @Body('password') password: string
  ): Promise<{ valid: boolean }> {
    const isValid = await this.userService.verifyPassword(userId, password);
    if (!isValid) {
      console.log('La contraseña es incorrecta.', isValid);
      throw new NotFoundException('La contraseña es incorrecta.');
    }
    return { valid: isValid };
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

  @Patch('password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res() res: Response
  ) {
    try {
      const updatedUser = await this.userService.updatePassword(id, updatePasswordDto);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Contraseña actualizada correctamente',
        data: updatedUser,
      });
    } catch (error) {
      console.error('Error capturado en el controlador:', error.message);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error interno del servidor',
      });
    }
  }



  @Put(':id')
  @UseInterceptors(FileInterceptor('ImgUrl', new MulterService().getMulterOptions('./src/uploads/imgPerfil')))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response
  ) {
    try {
      console.log("Entrando al controlador...");

      // Obtener el usuario actual para verificar si tiene una imagen anterior
      const currentUser = await this.userService.findOne(id);
      console.log("Usuario actual:", currentUser);

      if (file) {
        // Si el usuario tiene una imagen existente, eliminarla
        if (currentUser.ImgUrl) {

          console.log("djwkjlksjldks:", currentUser.ImgUrl);
          const oldImagePath = path.resolve('src/uploads/imgPerfil', currentUser.ImgUrl);
          console.log("Ruta de la imagen anterior:", oldImagePath);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // Eliminar la imagen anterior
            console.log(`Imagen anterior eliminada: ${oldImagePath}`);
          }
        }

        // Agrega el nombre de archivo a updateUserDto
        updateUserDto.ImgUrl = file.filename;
      }

      console.log("Datos recibidos para actualizar:", updateUserDto);

      const updatedUser = await this.userService.update(id, updateUserDto);

      return res.status(HttpStatus.OK).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      console.error('Error capturado en el controlador:', error.message);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error interno del servidor',
      });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) { // Cambiado a string
    return this.userService.remove(id); // No uses +id
  }
}
