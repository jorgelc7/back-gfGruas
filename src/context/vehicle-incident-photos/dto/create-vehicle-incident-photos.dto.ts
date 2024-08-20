import { IsOptional, IsString } from 'class-validator';
export class CreateVehicleIncidentPhotosDto {
    @IsOptional()
    @IsString()
    urlFrontal?: string;
  
    @IsOptional()
    @IsString()
    urlTrasera?: string;
  
    @IsOptional()
    @IsString()
    urlLateralDerechoCopiloto?: string;
  
    @IsOptional()
    @IsString()
    urlLateralIzquierdoConductor?: string;
  }
  