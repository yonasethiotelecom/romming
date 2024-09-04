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
import { Public } from 'src/public.decorator';
import { RommingReadingService } from './romming_reading.service';
import { CreateRommingReadingDto } from './dto/create-romming_reading.dto';
import { UpdateRommingReadingDto } from './dto/update-romming_reading.dto';
import { Jobshift } from '@prisma/client';

@Controller('romming-reading')
export class RommingReadingController {
  constructor(private readonly rommingReadingService: RommingReadingService) {}

  @Post()
  create(@Body() createRommingReadingDto: CreateRommingReadingDto) {
    return this.rommingReadingService.create(createRommingReadingDto);
  }

  @Get('sum')
  async findSUM(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    const datas = await this.rommingReadingService.findSUM(
      startDate,
      endDate,
      day,
    );

    return datas;
  }
  @Get('3G/sum')
  async findSUM3G(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    const datas = await this.rommingReadingService.findSUM3G(
      startDate,
      endDate,
      day,
    );

    return datas;
  }
  //@Public()
  @Get()
  async findAll(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    const datas = await this.rommingReadingService.findAll(
      startDate,
      endDate,
      day,
    );

    return convertData(datas);
  }

  @Get('AA')
  async findAllAA(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    const datas = await this.rommingReadingService.findAllAA(
      startDate,
      endDate,
      day,
    );

    return convertDataAA(datas);
  }

  @Get('NR')
  async findAllNR(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    const datas = await this.rommingReadingService.findAllNR(
      startDate,
      endDate,
      day,
    );

    return convertDataNR(datas);
  }

  @Get('ER')
  async findAllER(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    const datas = await this.rommingReadingService.findAllER(
      startDate,
      endDate,
      day,
    );

    return convertDataER(datas);
  }
  @Get('SSWR')
  async findAllSSWR(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    const datas = await this.rommingReadingService.findAllSSWR(
      startDate,
      endDate,
      day,
    );

    return convertDataSSWR(datas);
  }
  @Get('3G')
  async find3GAll(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    const datas = await this.rommingReadingService.findAll3G(
      startDate,
      endDate,
      day,
    );

    return convertData(datas);
  }

  @Get('3G/AA')
  async findAll3GAA(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    const datas = await this.rommingReadingService.findAll3GAA(
      startDate,
      endDate,
      day,
    );

    return convertDataAA(datas);
  }

  @Get('3G/NR')
  async findAll3GNR(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    const datas = await this.rommingReadingService.findAll3GNR(
      startDate,
      endDate,
      day,
    );

    return convertDataNR(datas);
  }

  @Get('3G/ER')
  async findAll3GER(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    const datas = await this.rommingReadingService.findAll3GER(
      startDate,
      endDate,
      day
    );

    return convertDataER(datas);
  }
  @Get('3G/SSWR')
  async findAll3GSSWR(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('day') day: Jobshift,
  ) {
    const datas = await this.rommingReadingService.findAll3GSSWR(
      startDate,
      endDate,
      day
    );

    return convertDataSSWR(datas);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rommingReadingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRommingReadingDto: UpdateRommingReadingDto,
  ) {
    return this.rommingReadingService.update(+id, updateRommingReadingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rommingReadingService.remove(+id);
  }
}

function convertData(data) {
  return data.map((item) => ({
    id:
      item.AllAverage.id +
      ' Av ' +
      calculateAverage(item.AllAverage.data).toFixed(2),
    color: item.AllAverage.color,
    data: item.AllAverage.data,
  }));
}
function convertDataAA(data) {
  return data.map((item) => ({
    id:
      item.AA_MSCS.id + ' Av ' + calculateAverage(item.AA_MSCS.data).toFixed(2),
    color: item.AA_MSCS.color,
    data: item.AA_MSCS.data,
  }));
}
function convertDataNR(data) {
  return data.map((item) => ({
    id:
      item.NR_MSCS.id + ' Av ' + calculateAverage(item.NR_MSCS.data).toFixed(2),
    color: item.NR_MSCS.color,
    data: item.NR_MSCS.data,
  }));
}

function convertDataER(data) {
  return data.map((item) => ({
    id:
      item.ER_MSCS.id + ' Av ' + calculateAverage(item.ER_MSCS.data).toFixed(2),
    color: item.ER_MSCS.color,
    data: item.ER_MSCS.data,
  }));
}
function convertDataSSWR(data) {
  return data.map((item) => ({
    id:
      item.SSWR_MSCS.id +
      ' Av ' +
      calculateAverage(item.SSWR_MSCS.data).toFixed(2),
    color: item.SSWR_MSCS.color,
    data: item.SSWR_MSCS.data,
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
