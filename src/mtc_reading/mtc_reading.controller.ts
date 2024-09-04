import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { MtcReadingService } from './mtc_reading.service';
import { Jobshift } from '@prisma/client';

@Controller('mtc-reading')
export class MtcReadingController {
  constructor(private readonly mtcReadingService: MtcReadingService) {}

  @Get('table')
  findAll(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    return this.mtcReadingService.findTable(startDate, endDate, day);
  }

  @Get('line')
  findLine(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    return this.mtcReadingService.findLine(startDate, endDate, day);
  }

  @Get('bar')
  findASRBar(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    return this.mtcReadingService.findASRBar(startDate, endDate, day);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mtcReadingService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mtcReadingService.remove(+id);
  }
}
