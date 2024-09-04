import { Module } from '@nestjs/common';
import { VoiceReadingService } from './voice_reading.service';
import { VoiceReadingController } from './voice_reading.controller';

@Module({
  controllers: [VoiceReadingController],
  providers: [VoiceReadingService],
})
export class VoiceReadingModule {}
