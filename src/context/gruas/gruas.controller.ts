import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus,Put } from '@nestjs/common';
import { GruasService } from './gruas.service';
import { CreateGruaDto } from './dto/create-grua.dto';
import { UpdateGruaDto } from './dto/update-grua.dto';

@Controller('gruas')
export class GruasController {
  constructor(private readonly gruasService: GruasService) { }

  @Post()
  create(@Body() createGruaDto: CreateGruaDto) {
    try {
      return this.gruasService.create(createGruaDto);

    } catch (error) {
      console.log('Error controller create a grua:', error);
      throw new HttpException('Error creating controller Grua', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {

    try {
      return this.gruasService.findAll();
    } catch (error) {
      console.log('Error controller get a grua:', error);
      throw new HttpException('Error findAll controller Grua', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.gruasService.findOne(id);
      
    } catch (error) {
      console.log('Error controller findOne a grua:', error);
      throw new HttpException('Error findOne controller Grua', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGruaDto: UpdateGruaDto) {

    try {
      
      return this.gruasService.update(id, updateGruaDto);
    } catch (error) {
      console.log('Error controller Patch a grua:', error);
      throw new HttpException('Error Patch controller Grua', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {

    try {
      return this.gruasService.remove(id);
      
    } catch (error) {
      console.log('Error controller Delete a grua:', error);
      throw new HttpException('Error Delete controller Grua', HttpStatus.BAD_REQUEST);
    }
  }
}
