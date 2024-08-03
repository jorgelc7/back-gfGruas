import { IsString, IsNotEmpty, IsNumber, Min, Max, IsEnum, IsDateString } from 'class-validator';

export class UpdateGruaDto {
  @IsString()
  @IsNotEmpty()
  patente: string;

  @IsString()
  @IsNotEmpty()
  marca: string;

  @IsString()
  @IsNotEmpty()
  modelo: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['ARRIENDO', 'DISPONIBLE', 'MANTENIMIENTO'])
  estado: string;
}
