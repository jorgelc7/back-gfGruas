import { IsDate, IsInt, IsString } from "class-validator";

export class CreateUserDto {
    // para mapear los datos que llegaran al controller
    @IsString()
    nombre_usuario: string;

    @IsString()
    email_usuario: string;

    @IsString()
    clave_usuario: string;

    @IsString()
    id_rol: string;


    @IsString()
    estado_usuario: number;

}
