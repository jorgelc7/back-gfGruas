import { IsString, IsNotEmpty, IsEnum, IsDateString, IsMongoId, IsNumber, ValidateNested, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class CoordenadasDto {
  @IsNumber()
  @IsNotEmpty()
  latitud: number;

  @IsNumber()
  @IsNotEmpty()
  longitud: number;
}

export class CreateCraneRequestsDto {
  @IsMongoId()
  @IsNotEmpty()
  clienteId: string;

  @IsMongoId()
  @IsNotEmpty()
  gruaId: string;

  @IsMongoId()
  @IsNotEmpty()
  driverId: string;

  @IsEnum(['PENDIENTE', 'EN_CURSO', 'EN_LUGAR', 'CON_CLIENTE_EN_CAMINO', 'COMPLETADO', 'CANCELADO'])
  @IsNotEmpty()
  estado: string;

  @ValidateNested()
  @Type(() => CoordenadasDto)
  @IsNotEmpty()
  coordenadasInicio: CoordenadasDto;

  @ValidateNested()
  @Type(() => CoordenadasDto)
  @IsNotEmpty()
  coordenadasDestino: CoordenadasDto;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @IsDateString()
  fechaFin?: string;

  @IsMongoId()
  @IsNotEmpty()
  fotosId: string;

  @IsString()
  @IsNotEmpty()
  total: string;

  distancia: string;

  tiempoLlegada: string;

  @IsOptional()
  @IsDate()
  driverLlegoRecogerVehiculo: Date;

  @IsOptional()
  @IsDate()
  driverComenzoViaje: Date;

  @IsOptional()
  @IsDate()
  driverCompletoServicio: Date;
}
 