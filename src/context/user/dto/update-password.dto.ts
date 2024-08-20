import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres.' })
  @MaxLength(20, { message: 'La contraseña debe tener máximo 100 caracteres.' })
  clave_usuario: string;
}
