import { Module } from '@nestjs/common';
import { MtcReadingService } from './mtc_reading.service';
import { MtcReadingController } from './mtc_reading.controller';

@Module({
  controllers: [MtcReadingController],
  providers: [MtcReadingService],
})
export class MtcReadingModule {}
