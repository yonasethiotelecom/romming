import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MocReadingService } from './moc_reading.service';
import { Jobshift } from '@prisma/client';

@Controller('moc-reading')
export class MocReadingController {
  constructor(private readonly mocReadingService: MocReadingService) {}

  @Get('table')
  findAll(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    return this.mocReadingService.findTable(startDate, endDate, day);
  }

  @Get('line')
  findLine(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    return this.mocReadingService.findLine(startDate, endDate, day);
  }

  @Get('bar')
  findASRBar(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    return this.mocReadingService.findASRBar(startDate, endDate, day);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mocReadingService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mocReadingService.remove(+id);
  }
}
