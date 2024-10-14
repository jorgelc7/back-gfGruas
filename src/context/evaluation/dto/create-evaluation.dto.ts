import { IsNotEmpty, IsString } from "class-validator";

export class CreateEvaluationDto {

    @IsNotEmpty()
    readonly arriendoId: string;  // ID del arriendo (CraneRequest)
    @IsNotEmpty()
    readonly rating: number;      // Calificación del servicio (1-5)
    @IsNotEmpty()
    @IsString()
    readonly comentario?: string; // Comentario opcional
  }
  