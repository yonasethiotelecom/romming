import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import * as ftp from 'basic-ftp';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';

interface InputData {
  [key: string]: {
    'Sum of Successful Location Updates During International Roaming (times)': number;
    'Sum of Location Update Requests During International Roaming (times)': number;
    LUSR: number;
  };
}

@Injectable()
export class VoiceMidService {
  constructor(private readonly prisma: PrismaService) {}
  async readAllCsvFilesrFomFtpServer(): Promise<any[]> {
    const client = new ftp.Client();

    try {
      await client.access({
        host: `${process.env.ftp_Ip}`,
        user: `${process.env.ftp_user}`,
        password: `${process.env.ftp_password}`,
        secure: false, // Set to true if you're using FTPS
      });

      const remoteDirectory = '/VoiceLocation/middle-day'; // Specify the remote directory path here
      await client.cd(remoteDirectory); // Change to the remote directory

      const files = await client.list(remoteDirectory); // List all files in the remote directory

      const results: any[] = [];

      for (const file of files) {
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0'); // Get the day and pad with leading zero if necessary
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Get the month (Note: January is 0)
        const year = currentDate.getFullYear().toString(); // Get the full year

        const formattedDate = `${year}-${month}-${day}`;
        console.log('date' + formattedDate);
        if (
          file.isFile &&
          file.name.endsWith('.csv') &&
          file.name.includes(formattedDate)
        ) {
          const localFilePath = `temp_${file.name}`;
          await client.downloadTo(localFilePath, file.name); // Download the file to a local temporary path

          const readStream = fs.createReadStream(localFilePath);
          const csvStream = readStream.pipe(csvParser({ headers: false }));
          //const csvStream = readStream.pipe(csvParser());

          const fileResults2G: any[] = [];
          const fileResults3G: any[] = [];

          for await (const data of csvStream) {
            const formattedDataH = {
              'Start Time': data[0],
              'Period (min)': data[1],
              'NE Name': data[2],
              Site: data[3],
              'Successful Location Updates During International Roaming (times)':
                data[4],
              'Location Update Requests During International Roaming (times)':
                data[5],
              'International Roamer LUSR (%)': data[6],
            };

            //  console.log('data', data);

            if (
              !formattedDataH.Site?.toLowerCase().includes('test') &&
              !formattedDataH.Site?.toLowerCase().includes('n/a') &&
              formattedDataH.Site! &&
              formattedDataH.Site?.toLowerCase().includes('gci=')
            ) {
              fileResults2G.push(formattedDataH);
            }

            if (
              !formattedDataH.Site?.toLowerCase().includes('test') &&
              !formattedDataH.Site?.toLowerCase().includes('n/a') &&
              formattedDataH.Site! &&
              formattedDataH.Site?.toLowerCase().includes('sai=')
            ) {
              fileResults3G.push(formattedDataH);
            }
          }

          const aggregatedData2GA_su = aggregateSite(
            fileResults2G,
            'Successful Location Updates During International Roaming (times)',
          );

          const aggregatedData2GA_req = aggregateSite(
            fileResults2G,
            'Location Update Requests During International Roaming (times)',
          );

          const aggregatedData3GA_su = aggregateSite(
            fileResults3G,
            'Successful Location Updates During International Roaming (times)',
          );

          const aggregatedData3GA_req = aggregateSite(
            fileResults3G,
            'Location Update Requests During International Roaming (times)',
          );

          const LUSR2G = aggregateData(
            aggregatedData2GA_su,
            aggregatedData2GA_req,
          );
          const LUSR3G = aggregateData(
            aggregatedData3GA_su,
            aggregatedData3GA_req,
          );

          const aggregateLUSR2G = aggregateLUSR(fileResults2G);
          const aggregateLUSR3G = aggregateLUSR(fileResults3G);

          //prisma]

          let existingfileName = await this.prisma.fileName.findUnique({
            where: { name: file.name + 'mid' },
            select: { id: true },
          });

          if (!existingfileName) {
            existingfileName = await this.prisma.fileName.create({
              data: {
                name: file.name + 'mid',
              },
              select: { id: true },
            });

            await this.prisma.lusr2G.create({
              data: {
                LUSR: transformData(LUSR2G),
                LUSRAverage: transformJson(aggregateLUSR2G),
                shift: 'mid',
                fileId: existingfileName.id,
              },
            });
            await this.prisma.lusr3G.create({
              data: {
                LUSR: transformData(LUSR3G),
                LUSRAverage: transformJson(aggregateLUSR3G),
                shift: 'mid',
                fileId: existingfileName.id,
              },
            });
          }

          const fileObject = {
            fileName: file.name + 'mid',

            LUSR2G: transformData(LUSR2G),
            LUSR3G: transformData(LUSR3G),
            aggregateLUSR2G: transformJson(aggregateLUSR2G),
            aggregateLUSR3G: transformJson(aggregateLUSR3G),
          };

          results.push(fileObject); // Push the file object to the main results array

          fs.unlinkSync(localFilePath); // Remove the temporary file after reading
        } else {
          //delete

          await client.remove(file.name);
        }
      }

      return results;
    } catch (err) {
      throw new Error(`Failed to read CSV files from FTP server: ${err}`);
    } finally {
      client.close();
    }
  }
}

function aggregateLUSR(data: any) {
  const aggregated = {};
  const count = {};

  data.forEach((item) => {
    const site = item['Start Time'];

    // console.log('sta' + site);
    const value = item['International Roamer LUSR (%)'].toLowerCase(); // Convert to lowercase
    const searchString = 'nil';

    if (value.includes(searchString.toLowerCase())) {
      return; // Skip iteration when the value contains 'nil' (case-insensitive)
    }
    const amount = parseFloat(item['International Roamer LUSR (%)']);

    //  console.log('amo' + amount);
    if (aggregated[site]) {
      aggregated[site] += amount;
      count[site]++;
    } else {
      aggregated[site] = amount;
      count[site] = 1;
    }
  });

  const result = {};
  Object.keys(aggregated).forEach((site) => {
    result[site] = aggregated[site] / count[site];
  });
  const values = Object.values(result);
  const sum = values.reduce((acc: number, curr: number) => acc + curr, 0);

  return result;
}

function aggregateSite(data: any, s: string) {
  const aggregated = {};
  const count = {};

  data.forEach((item) => {
    const site = item.Site;

    // console.log('sta' + site);
    const amount = parseFloat(item[s]);

    //  console.log('amo' + amount);
    if (aggregated[site]) {
      aggregated[site] += amount;
      count[site]++;
    } else {
      aggregated[site] = amount;
      count[site] = 1;
    }
  });

  const result = {};
  Object.keys(aggregated).forEach((site) => {
    result[site] = aggregated[site] / count[site];
  });
  const values = Object.values(result);
  const sum = values.reduce((acc: number, curr: number) => acc + curr, 0);

  return aggregated;
}

function aggregateData(data1, data2) {
  const aggregatedData = {};

  for (const key in data1) {
    const persont = ((data1[key] / data2[key]) * 100) | 0;
    aggregatedData[key] = {
      'Sum of Successful Location Updates During International Roaming (times)':
        data1[key],
      'Sum of Location Update Requests During International Roaming (times)':
        data2[key],
      LUSR: persont,
    };
  }

  return aggregatedData;
}

function transformData(data: InputData): string {
  const transformed: any = Object.keys(data).map((key, index) => {
    return {
      id: index.toString(),
      node: key,
      ...data[key],
    };
  });
  return transformed;
}

function transformJson(data) {
  let id = 'date';
  let color = 'color';

  const obj = Object.keys(data).map((key) => {
    const [date, time] = key.split(' ');
    id = date;
    color = getColorCode(date);
    return {
      x: time,
      y: data[key],
    };
  });
  return { id: id, color: color, data: obj };
}

function getColorCode(date) {
  const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const weekdayIndex = new Date(date).getDay();
  const weekday = weekdays[weekdayIndex];
  switch (weekday) {
    case 'Monday':
      return 'hsl(15, 80%, 60%)'; // Warm orange
    case 'Tuesday':
      return 'hsl(90, 70%, 50%)'; // Bright yellow-green
    case 'Wednesday':
      return 'hsl(180, 80%, 50%)'; // Turquoise
    case 'Thursday':
      return 'hsl(240, 70%, 60%)'; // Lavender
    case 'Friday':
      return 'hsl(300, 80%, 55%)'; // Fuchsia
    case 'Saturday':
      return 'hsl(345, 80%, 55%)'; // Magenta
    case 'Sunday':
      return 'hsl(0, 90%, 55%)'; // Scarlet
    default:
      return 'hsl(60, 50%, 70%)'; // Light olive
  }
}
