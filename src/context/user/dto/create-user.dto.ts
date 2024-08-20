import { IsString, IsInt, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsString()
    rut_usuario: string;
  
    @IsString()
    nombre_usuario: string;
  
    @IsString()
    email_usuario: string;
  
    @IsString()
    clave_usuario: string;
  
    @IsString()
    id_rol: string;
  
    @IsInt()
    estado_usuario: number;

    @IsString()  
    telefono: string;

    @IsOptional()
    @IsString()
    ImgUrl?: string;  // Agregada al DTO
}
