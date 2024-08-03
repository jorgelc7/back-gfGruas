import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RolUsuarioSchema } from './entities/role.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'RolUsuario', schema: RolUsuarioSchema }])
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}




// import { Module } from '@nestjs/common';
// import { RolesService } from './roles.service';
// import { RolesController } from './roles.controller';
// import { SequelizeModule } from '@nestjs/sequelize';
// import { RolUsuario } from './entities/role.entity';

// @Module({
//   imports: [SequelizeModule.forFeature([RolUsuario])],
//   controllers: [RolesController],
//   providers: [RolesService],
//   exports: [SequelizeModule]
// })
// export class RolesModule {}
