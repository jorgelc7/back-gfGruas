import { IsString } from "class-validator";

export class CreateRoleDto {

    @IsString()
    nombre: string;
    @IsString()
    descripcion: string;
    @IsString()
    estado: string;

}
