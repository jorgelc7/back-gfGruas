// update-user.dto.ts
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nombre_usuario?: string;

  @IsOptional()
  @IsEmail()
  email_usuario?: string;

  @IsOptional()
  @IsString()
  clave_usuario?: string;

  @IsOptional()
  @IsString()
  estado_usuario?: number;
}
