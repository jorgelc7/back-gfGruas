import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto{
    @IsEmail()
    email_usuario: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(6)
    clave_usuario: string;
}