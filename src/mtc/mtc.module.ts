import { Module } from '@nestjs/common';
import { MtcService } from './mtc.service';
import { MtcMidService } from './mtc_mid.service';
import { MtcNightService } from './mtc_night.service';

@Module({
  providers: [MtcService, MtcMidService, MtcNightService],
  exports: [MtcService, MtcMidService, MtcNightService],
})
export class MtcModule {}
