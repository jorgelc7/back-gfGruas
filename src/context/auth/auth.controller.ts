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
    return this.authService.register(registroDto);
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
