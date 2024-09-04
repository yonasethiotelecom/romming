import { Module } from '@nestjs/common';
import { VoiceService } from './voice.service';
import { VoiceMidService } from './voice_mid.service';
import { VoiceNightService } from './voice_night.service';

@Module({
  providers: [VoiceService, VoiceMidService, VoiceNightService],
  exports: [VoiceService, VoiceMidService, VoiceNightService],
})
export class VoiceModule {}
