import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UsuarioSchema } from './entities/user.entity';
import { RolUsuarioSchema } from '../roles/entities/role.entity';
import { RolesModule } from '../roles/roles.module';
import { RolesService } from '../roles/roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Usuario', schema: UsuarioSchema },
      { name: 'RolUsuario', schema: RolUsuarioSchema }
    ]),
    RolesModule
  ],
  controllers: [UserController],
  providers: [UserService, RolesService],
  exports: [UserService]
})
export class UserModule {} 



// import { Module } from '@nestjs/common';
// import { UserService } from './user.service';
// import { SequelizeModule } from '@nestjs/sequelize';
// import { Usuario } from './entities/user.entity';
// import { UserController } from './user.controller';
// import { RolUsuario } from '../roles/entities/role.entity';
// import { RolesModule } from '../roles/roles.module';
// import { RolesService } from '../roles/roles.service';

// @Module({
//   imports: [SequelizeModule.forFeature([Usuario]), RolesModule],
//   controllers: [UserController],
//   providers: [UserService, RolesService],
//   exports: [UserService]
// })
// export class UserModule {}
