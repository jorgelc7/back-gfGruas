import { IsString, IsNotEmpty, IsNumber, Min, Max, IsEnum, IsDateString } from 'class-validator';

export class CreateGruaDto {
  @IsString()
  @IsNotEmpty()
  patente: string;

  @IsString()
  @IsNotEmpty()
  marca: string;

  @IsString()
  @IsNotEmpty()
  modelo: string;

  // @IsNumber()
  // @Min(1900)
  // @Max(new Date().getFullYear())
  @IsNotEmpty()
  year: Date;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['ARRIENDO', 'DISPONIBLE', 'MANTENIMIENTO'])
  estado: string;
}
