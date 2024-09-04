import { PartialType } from '@nestjs/mapped-types';
import { CreateRommingReadingDto } from './create-romming_reading.dto';

export class UpdateRommingReadingDto extends PartialType(CreateRommingReadingDto) {}
