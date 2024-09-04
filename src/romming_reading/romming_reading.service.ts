import { Injectable } from '@nestjs/common';
import { CreateRommingReadingDto } from './dto/create-romming_reading.dto';
import { UpdateRommingReadingDto } from './dto/update-romming_reading.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Jobshift } from '@prisma/client';

@Injectable()
export class RommingReadingService {
  constructor(private readonly prisma: PrismaService) {}
  create(createRommingReadingDto: CreateRommingReadingDto) {
    return 'This action adds a new rommingReading';
  }

  async findSUM(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.sumOfAverages2G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        Averages2G: true,
        createdAt: true,
      },
    });
  }

  async findSUM3G(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.sumOfAverages3G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        Averages3G: true,
        createdAt: true,
      },
    });
  }

  async findAll(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.inboundRoamer2G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        AllAverage: true,
      },
    });
  }
  async findAllAA(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.inboundRoamer2G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        AA_MSCS: true,
      },
    });
  }

  async findAllNR(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.inboundRoamer2G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        NR_MSCS: true,
      },
    });
  }

  async findAllER(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.inboundRoamer2G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        ER_MSCS: true,
      },
    });
  }

  async findAllSSWR(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.inboundRoamer2G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        SSWR_MSCS: true,
      },
    });
  }

  async findAll3G(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.inboundRoamer3G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        AllAverage: true,
      },
    });
  }
  async findAll3GAA(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.inboundRoamer3G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        AA_MSCS: true,
      },
    });
  }

  async findAll3GNR(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.inboundRoamer3G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        NR_MSCS: true,
      },
    });
  }

  async findAll3GER(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.inboundRoamer3G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        ER_MSCS: true,
      },
    });
  }

  async findAll3GSSWR(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.inboundRoamer3G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        SSWR_MSCS: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} rommingReading`;
  }

  update(id: number, updateRommingReadingDto: UpdateRommingReadingDto) {
    return `This action updates a #${id} rommingReading`;
  }

  remove(id: number) {
    return `This action removes a #${id} rommingReading`;
  }
}
