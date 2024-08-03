import { Transform } from "class-transformer";
import { IsEmail, IsInt, IsNumber, IsString, MinLength } from "class-validator";

export class RegistroDto {

    @Transform(({ value }) => value?.trim())
    @IsString()
    @MinLength(1)
    nombre_usuario: string;

    @IsEmail()
    email_usuario: string;

    @IsString()
    @MinLength(6)
    clave_usuario: string;

    @IsInt()
    estado_usuario: number;

    @IsString()
    id_rol: string;



}
