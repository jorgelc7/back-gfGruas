import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsInt, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class RegistroDto {
    @IsString()
    rut_usuario: string;
    @Transform(({ value }) => value?.trim())
    @IsString()
    @MinLength(1)
    nombre_usuario: string;

    @IsEmail()
    email_usuario: string;

    @IsString()
    @MinLength(6)
    clave_usuario: string;

    @IsOptional()
    @IsBoolean()
    estado_usuario: boolean;

    // @IsString()
    // id_rol: string;
    @IsString()  // Asegúrate de usar la validación correcta si es string o número
    telefono: string;



}
