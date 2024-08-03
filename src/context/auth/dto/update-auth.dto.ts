import { PartialType } from '@nestjs/mapped-types';
import { RegistroDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(RegistroDto) {}
