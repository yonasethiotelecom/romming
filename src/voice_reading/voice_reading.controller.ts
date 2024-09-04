import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { VoiceReadingService } from './voice_reading.service';
import { CreateVoiceReadingDto } from './dto/create-voice_reading.dto';
import { UpdateVoiceReadingDto } from './dto/update-voice_reading.dto';
import { Jobshift } from '@prisma/client';

@Controller('voice-reading')
export class VoiceReadingController {
  constructor(private readonly voiceReadingService: VoiceReadingService) {}

  @Post()
  create(@Body() createVoiceReadingDto: CreateVoiceReadingDto) {
    return this.voiceReadingService.create(createVoiceReadingDto);
  }

  @Get('2G/LUSR')
  findLUSR(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    return this.voiceReadingService.findLUSR(startDate, endDate, day);
  }
  @Get('2G/LUSR/Agrigate')
  async findLUSRAg(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    const rowdata = await this.voiceReadingService.findLUSRAg(
      startDate,
      endDate,
      day,
    );
    return convertData(rowdata);
  }
  @Get('2G/LUSR/BAR')
  findLUSRBar2G(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    return this.voiceReadingService.findLUSRBar2G(startDate, endDate, day);
  }
  @Get('3G/LUSR')
  findLUSR3G(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    return this.voiceReadingService.findLUSR3G(startDate, endDate, day);
  }
  @Get('3G/LUSR/Agrigate')
  async findLUSR3GAg(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    const rowdata = await this.voiceReadingService.findLUSR3GAg(
      startDate,
      endDate,
      day,
    );
    return convertData(rowdata);
  }
  @Get('3G/LUSR/BAR')
  findLUSRBar3G(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    return this.voiceReadingService.findLUSRBar3G(startDate, endDate, day);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voiceReadingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVoiceReadingDto: UpdateVoiceReadingDto,
  ) {
    return this.voiceReadingService.update(+id, updateVoiceReadingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voiceReadingService.remove(+id);
  }
}

function convertData(data) {
  return data.map((item) => ({
    id:
      item.LUSRAverage.id +
      ' Av ' +
      calculateAverage(item.LUSRAverage.data).toFixed(2),
    color: item.LUSRAverage.color,
    data: item.LUSRAverage.data,
  }));
}

function calculateAverage(data) {
  // Check if the data array is empty
  if (data.length === 0) {
    return 0;
  }

  // Sum all the 'y' values
  const totalY = data.reduce((sum, item) => sum + item.y, 0);

  // Calculate the average 'y' value
  const averageY = totalY / data.length;

  return averageY;
}
