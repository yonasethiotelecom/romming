import { PartialType } from '@nestjs/mapped-types';
import { CreateVoiceReadingDto } from './create-voice_reading.dto';

export class UpdateVoiceReadingDto extends PartialType(CreateVoiceReadingDto) {}
