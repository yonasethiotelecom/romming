import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { Jobshift } from '@prisma/client';

@Injectable()
export class MocReadingService {
  constructor(private readonly prisma: PrismaService) {}

  findTable(startDate: Date, endDate: Date, day: Jobshift) {
    return this.prisma.moc_Asr.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },

      select: {
        ASR: true,
        createdAt: true,
      },
    });
  }

  async findLine(startDate: Date, endDate: Date, day: Jobshift) {
    const nivoline = await this.prisma.moc_Asr.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },

      select: {
        ASR: true,
        createdAt: true,
      },
    });

    return convertData(nivoline);
  }

  async findASRBar(startDate: Date, endDate: Date, day: Jobshift) {
    const ASRBAR = await this.prisma.moc_Asr.findMany({
      where: {
        shift: day,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },

      select: {
        ASR: true,
        createdAt: true,
      },
    });
    return aggregateASR(ASRBAR);
  }

  findAll() {
    return `This action returns all mocReading`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mocReading`;
  }

  remove(id: number) {
    return `This action removes a #${id} mocReading`;
  }
}

const aggregateASR = (data) => {
  return data.map((entry) => {
    const validEntries = entry.ASR.filter(
      (item) => typeof item.ASR === 'number' && !isNaN(item.ASR),
    );

    // Sum all the valid ASR values
    const totalASR = validEntries.reduce(
      (accumulator, currentValue) => accumulator + currentValue.ASR,
      0,
    );

    // Calculate the average ASR
    const averageASR = totalASR / validEntries.length;

    return {
      createdAt: extractDate(entry.createdAt),
      averageASR: averageASR.toFixed(2),
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

function convertData(originalData) {
  const result = [];

  originalData.forEach((entry) => {
    console.log(typeof entry.createdAt);
    console.log(entry.ASR);

    // Filter out entries where ASR is not a number
    const validEntries = entry.ASR.filter(
      (item) => typeof item.ASR === 'number' && !isNaN(item.ASR),
    );

    // Sum all the valid ASR values
    const totalASR = validEntries.reduce(
      (accumulator, currentValue) => accumulator + currentValue.ASR,
      0,
    );

    // Calculate the average ASR
    const averageASR = totalASR / validEntries.length;

    const date =
      extractDate(entry.createdAt) + ' MOC ASR ' + averageASR.toFixed(2);

    const dataEntry = {
      id: date,
      color: getColorCode(entry.createdAt),
      data: [],
    };

    entry.ASR.forEach((asrEntry) => {
      const yValue = typeof asrEntry.ASR === 'number' ? asrEntry.ASR : 0;
      dataEntry.data.push({
        x: asrEntry.node,
        y: yValue,
      });
    });

    result.push(dataEntry);
  });

  return result;
}
