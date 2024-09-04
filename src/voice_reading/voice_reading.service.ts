import { Injectable } from '@nestjs/common';
import { CreateVoiceReadingDto } from './dto/create-voice_reading.dto';
import { UpdateVoiceReadingDto } from './dto/update-voice_reading.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Jobshift } from '@prisma/client';

@Injectable()
export class VoiceReadingService {
  constructor(private readonly prisma: PrismaService) {}
  create(createVoiceReadingDto: CreateVoiceReadingDto) {
    return 'This action adds a new voiceReading';
  }

  findLUSR(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.lusr2G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },

      select: {
        LUSR: true,
        createdAt: true,
      },
    });
  }

  findLUSRAg(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.lusr2G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },

      select: {
        LUSRAverage: true,
        createdAt: true,
      },
    });
  }
  findLUSR3GAg(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.lusr3G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },

      select: {
        LUSRAverage: true,
        createdAt: true,
      },
    });
  }

  findLUSR3G(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.lusr3G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },

      select: {
        LUSR: true,
        createdAt: true,
      },
    });
  }

  async findLUSRBar2G(startDate: Date, endDate: Date, day: Jobshift) {
    const LUSRBAR = await this.prisma.lusr2G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },

      select: {
        LUSR: true,
        createdAt: true,
      },
    });
    return aggregateLUSR(LUSRBAR);
  }

  async findLUSRBar3G(startDate: Date, endDate: Date, day: Jobshift) {
    const LUSRBAR = await this.prisma.lusr3G.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },

      select: {
        LUSR: true,
        createdAt: true,
      },
    });
    return aggregateLUSR(LUSRBAR);
  }

  findOne(id: number) {
    return `This action returns a #${id} voiceReading`;
  }

  update(id: number, updateVoiceReadingDto: UpdateVoiceReadingDto) {
    return `This action updates a #${id} voiceReading`;
  }

  remove(id: number) {
    return `This action removes a #${id} voiceReading`;
  }
}

const aggregateLUSR = (data) => {
  return data.map((entry) => {
    const totalLUSR = entry.LUSR.reduce((sum, item) => sum + item.LUSR, 0);
    const averageLUSR = totalLUSR / entry.LUSR.length;

    return {
      createdAt: extractDate(entry.createdAt),
      averageLUSR: averageLUSR,
      color: getColorCode(entry.createdAt),
    };
  });
};
function getColorCode(isoDateString) {
  const dateObj = new Date(isoDateString);
  const month = dateObj.getMonth(); // 0 (Jan) to 11 (Dec)
  const day = dateObj.getDate(); // 1 to 31

  // Total days in each month (non-leap year for simplicity)
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Calculate a unique index based on month and day
  let uniqueIndex = day;
  for (let i = 0; i < month; i++) {
    uniqueIndex += daysInMonth[i];
  }

  // There are 365 possible days in a non-leap year
  const totalDays = 365;

  // Calculate the hue based on the unique index
  const hue = Math.floor((uniqueIndex * 360) / totalDays) % 360;

  // Return the HSL color code
  return `hsl(${hue}, 70%, 50%)`;
}

function extractDate(isoDateString) {
  const dateObj = new Date(isoDateString);

  // Get the year, month, and day
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(dateObj.getDate()).padStart(2, '0');

  // Return the formatted date as "YYYY-MM-DD"
  return `${year}-${month}-${day}`;
}
