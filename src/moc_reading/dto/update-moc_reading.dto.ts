import { PartialType } from '@nestjs/mapped-types';
import { CreateMocReadingDto } from './create-moc_reading.dto';

export class UpdateMocReadingDto extends PartialType(CreateMocReadingDto) {}
