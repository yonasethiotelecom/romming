import { Module } from '@nestjs/common';
import { SrService } from './sr.service';

@Module({
  providers: [SrService],
  exports: [SrService]
})
export class SrModule {}
