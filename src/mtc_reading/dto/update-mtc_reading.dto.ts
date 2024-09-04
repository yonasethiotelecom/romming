import { PartialType } from '@nestjs/mapped-types';
import { CreateMtcReadingDto } from './create-mtc_reading.dto';

export class UpdateMtcReadingDto extends PartialType(CreateMtcReadingDto) {}
