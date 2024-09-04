import { Module } from '@nestjs/common';
import { PlmnService } from './plmn.service';

@Module({
  providers: [PlmnService],
  exports: [PlmnService],
})
export class PlmnModule {}
