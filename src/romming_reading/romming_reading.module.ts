import { Module } from '@nestjs/common';
import { RommingReadingService } from './romming_reading.service';
import { RommingReadingController } from './romming_reading.controller';

@Module({
  controllers: [RommingReadingController],
  providers: [RommingReadingService],
})
export class RommingReadingModule {}
