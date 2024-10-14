import { IsString, IsNotEmpty, IsEnum, IsMongoId, IsNumber, ValidateNested, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoCraneRequest } from '../entities/crane-requests.entity';

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
  @IsOptional()
  gruaId: string;

  @IsMongoId()
  @IsOptional()
  driverId: string;

  @IsEnum(EstadoCraneRequest)
  estado: EstadoCraneRequest;

  @ValidateNested()
  @Type(() => CoordenadasDto)
  @IsNotEmpty()
  coordenadasInicio: CoordenadasDto;

  @ValidateNested()
  @Type(() => CoordenadasDto)
  @IsNotEmpty()
  coordenadasDestino: CoordenadasDto;

  //@IsDate()
  fechaInicio: Date;

  //@IsDate()
  fechaFin?: Date;

  @IsMongoId()
  @IsOptional()
  fotosId: string;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsString()
  @IsNotEmpty()
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

  // @IsString()
  // @IsNotEmpty()
  // tipoVehiculo: string;

  @IsString()
  @IsNotEmpty()
  patente: string;

  @IsString()
  @IsNotEmpty()
  tiempoRutaCliente: string;

  @IsString()
  @IsNotEmpty()
  direccionRecogida

  @IsString()
  @IsNotEmpty()
  direccionEntrega

  @IsString()
  @IsNotEmpty()
  vehicleClientImageUrl

  @IsOptional()
  ubicacionActualDriver?


}
