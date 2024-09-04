import { Module } from '@nestjs/common';
import { MocService } from './moc.service';
import { MocMidService } from './moc_mid.service';
import { MocNightService } from './moc_night.service';

@Module({
  providers: [MocService, MocMidService, MocNightService],
  exports: [MocService, MocMidService, MocNightService],
})
export class MocModule {}
