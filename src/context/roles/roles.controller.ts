import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Logger, HttpStatus } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Response } from 'express';

@Controller('roles')
export class RolesController {

   private readonly logger = new Logger(RolesController.name);
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
        const roles = await this.rolesService.findAll();
        return res.status(HttpStatus.OK).json({
          success: true,
          data: roles,
        });
      } catch (error) {
        this.logger.error(`Error al buscar roles: ${error.message}`, error.stack);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Error interno del servidor',
        });
      }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {  // Cambia el tipo de id a string
    return this.rolesService.findOne(id);  // No uses +id
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {  // Cambia el tipo de id a string
    return this.rolesService.update(id, updateRoleDto);  // No uses +id
  }

  @Delete(':id')
  remove(@Param('id') id: string) {  // Cambia el tipo de id a string
    return this.rolesService.remove(id);  // No uses +id
  }
}



// import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Logger, HttpStatus } from '@nestjs/common';
// import { RolesService } from './roles.service';
// import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';
// import { Response } from 'express';

// @Controller('roles')
// export class RolesController {

//    private readonly logger = new Logger(RolesController.name);
//   constructor(private readonly rolesService: RolesService) {}

//   @Post()
//   create(@Body() createRoleDto: CreateRoleDto) {
//     return this.rolesService.create(createRoleDto);
//   }

//   @Get()
//   async findAll(@Res() res: Response) {
//     try {
//         const roles = await this.rolesService.findAll();
//         return res.status(HttpStatus.OK).json({
//           success: true,
//           data: roles,
//         });
//       } catch (error) {
//         this.logger.error(`Error al buscar usuarios: ${error.message}`, error.stack);
//         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//           success: false,
//           message: 'Error interno del servidor',
//         });
//       }
//   }

//   @Get(':id')
//   findOne(@Param('id') id: number) {
//     return this.rolesService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
//     return this.rolesService.update(+id, updateRoleDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: number) {
//     return this.rolesService.remove(+id);
//   }
// }
