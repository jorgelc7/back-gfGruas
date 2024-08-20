import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegistroDto } from './dto/create-auth.dto';
import * as bcryptjs from 'bcryptjs'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async register(registroDto: RegistroDto) {
    const user = await this.userService.findOneByEmail(registroDto.email_usuario);
    if (user) {
      throw new BadRequestException('El usuario ya existe');
    }
    // Generar el hash de la contraseña
    const hashedPassword = await bcryptjs.hash(registroDto.clave_usuario, 10);
    // Crear un nuevo objeto de RegistroDto con la contraseña hasheada
    const registroDtoHashed = { ...registroDto, clave_usuario: hashedPassword };
    // Crear el usuario con la contraseña hasheada
    return await this.userService.create(registroDtoHashed);
  }

  async login({ email_usuario, clave_usuario }: LoginDto) {
    const user = await this.userService.findOneByEmail(email_usuario);
    if (!user) {
      throw new UnauthorizedException('El email no es correcto');
    }

    const contraseñaValida = await bcryptjs.compare(clave_usuario, user.clave_usuario);
    if (!contraseñaValida) {
      throw new UnauthorizedException('La clave es incorrecta');
    }
    const payload = {
      id: user.id,
      email: user.email_usuario,
      usuario: user.nombre_usuario,
      rol: user.id_rol,
      nombreRol: user.id_rol['nombre']
    }
    console.log("REsputes al fornt: ", payload)
    const userToken = await this.jwtService.signAsync(payload)
    const nombreRol = user.id_rol['nombre']
    const UserId = user._id
    return { userToken, email_usuario, nombreRol, UserId };
  }


}
