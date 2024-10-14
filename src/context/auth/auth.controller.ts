import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistroDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController { 
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('register')
  register(@Body() registroDto: RegistroDto) {
    const CLIENT_ROLE_ID = '66aab46c06f5ffc91bd87ef8'; // ID del rol de cliente
    const id_rol = registroDto.id_rol || CLIENT_ROLE_ID; // Asigna cliente si no se proporciona
    const createUser = { ...registroDto, id_rol };
    return this.authService.register(createUser);
  }
  

  @Post('login')

  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  profile(@Request() req) {
    return req.user;
  }
}

export default AuthController; // Asegúrate de tener esta línea
