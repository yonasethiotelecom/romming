import { Module } from '@nestjs/common';
import { RommingService } from './romming.service';
import { RommingNightService } from './romming_night.service';
import { RommingMidService } from './romming_mid.service';

@Module({
  providers: [RommingService, RommingMidService, RommingNightService],
  exports: [RommingService, RommingMidService, RommingNightService],
})
export class RommingModule {}
