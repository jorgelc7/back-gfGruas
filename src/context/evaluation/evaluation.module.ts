import { Module } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EvaluationSchema } from './entities/evaluation.entity';
import { CraneRequestSchema } from '../Crane-Requests/entities/crane-requests.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Evaluation', schema: EvaluationSchema },
      { name: 'CraneRequest', schema: CraneRequestSchema },  // Importa el modelo de arriendo
    ]),
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
})
export class EvaluationModule {}
