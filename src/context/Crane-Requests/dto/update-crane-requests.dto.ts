import { PartialType } from '@nestjs/mapped-types';
import { CreateCraneRequestsDto } from './create-crane-requests.dto';

export class UpdateCraneRequestsDto extends PartialType(CreateCraneRequestsDto) {}
