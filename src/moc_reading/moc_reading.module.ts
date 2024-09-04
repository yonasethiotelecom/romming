import { Module } from '@nestjs/common';
import { MocReadingService } from './moc_reading.service';
import { MocReadingController } from './moc_reading.controller';

@Module({
  controllers: [MocReadingController],
  providers: [MocReadingService],
})
export class MocReadingModule {}
