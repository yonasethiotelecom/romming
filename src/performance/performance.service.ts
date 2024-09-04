import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import * as ftp from 'basic-ftp';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';

@Injectable()
export class PerformanceService {
  constructor(private readonly prisma: PrismaService) {}
  async readAllCsvFilesrFomFtpServer(): Promise<any[]> {
    const client = new ftp.Client();

    try {
      await client.access({
        host: '172.22.158.159',
        user: 'test1',
        password: 'Winta@2754',
        secure: false, // Set to true if you're using FTPS
      });

      const remoteDirectory = '/Performance'; // Specify the remote directory path here
      await client.cd(remoteDirectory); // Change to the remote directory

      const files = await client.list(remoteDirectory); // List all files in the remote directory

      const results: any[] = [];

      for (const file of files) {
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0'); // Get the day and pad with leading zero if necessary
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Get the month (Note: January is 0)
        const year = currentDate.getFullYear().toString(); // Get the full year

        const formattedDate = `${year}${month}${day}`;
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

          const formattedDataComfone: any[] = [];
          const formattedDatabics: any[] = [];
          for await (const data of csvStream) {
            const formattedDataH = {
              'Begin Time': data[0],
              'End Time': data[1],
              Granularity: data[2],
              NE: data[3],
              SERVICE: data[4],
              'Measurement Object': data[5],
              'Duration(s) of Signalling Link out of Service': data[6],
              'Times of Signalling Link out of Service': data[7],
              'Number of Message Signal Unit Sent': data[8],
              'Number of Message Signal Unit Received': data[9],
            };
            console.log('data', formattedDataH);

            if (
              formattedDataH['Measurement Object']
                ?.toLowerCase()
                .includes('conmfone') ||
              formattedDataH['Measurement Object']
                ?.toLowerCase()
                .includes('comfone')
            ) {
              formattedDataComfone.push(formattedDataH);
            }
            if (
              formattedDataH['Measurement Object']
                ?.toLowerCase()
                .includes('bics')
            ) {
              formattedDatabics.push(formattedDataH);
            }
          }

          const SDSLC = aggregateSite(
            formattedDataComfone,
            'Duration(s) of Signalling Link out of Service',
          );
          const SNMSUSC = aggregateSite(
            formattedDataComfone,
            'Number of Message Signal Unit Sent',
          );

          const SNMSURC = aggregateSite(
            formattedDataComfone,
            'Number of Message Signal Unit Received',
          );
          //bics

          const SDSLB = aggregateSite(
            formattedDatabics,
            'Duration(s) of Signalling Link out of Service',
          );
          const SNMSUSB = aggregateSite(
            formattedDatabics,
            'Number of Message Signal Unit Sent',
          );

          const SNMSURB = aggregateSite(
            formattedDatabics,
            'Number of Message Signal Unit Received',
          );

          // console.log(aggregatedDataAns);
          //console.log(aggregatedDataGA_Att);

          //prisma

          let existingfileName = await this.prisma.fileName.findUnique({
            where: { name: file.name },
            select: { id: true },
          });

          if (!existingfileName) {
            existingfileName = await this.prisma.fileName.create({
              data: {
                name: file.name,
              },
              select: { id: true },
            });

            /*  await this.prisma.mtc_Asr.create({
                    data: {
                      ASR: ASR,
                      fileId: existingfileName.id,
                    },
                  }); */
          }

          const fileObject = {
            fileName: file.name,
            SDSLC: SDSLC,
            SNMSUSC: SNMSUSC,
            SNMSURC: SNMSURC,

            SDSLB: SDSLB,
            SNMSUSB: SNMSUSB,
            SNMSURB: SNMSURB,
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

function aggregateSite(data: any, s: string) {
  const aggregated = {};
  const count = {};

  data.forEach((item) => {
    const site = item['Begin Time'];

    const value = item[s].toLowerCase(); // Convert to lowercase
    const searchString = 'nil';

    if (value.includes(searchString.toLowerCase())) {
      return; // Skip iteration when the value contains 'nil' (case-insensitive)
    }

    // console.log('sta' + site);
    const amount = parseFloat(item[s].replace(',', ''));

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

function aggregateData(
  data1: { [x: string]: any },
  data2: { [x: string]: any },
) {
  const aggregatedData = {};

  for (const key in data1) {
    const persont = (data1[key] / data2[key]) * 100 || 'Div/0';
    aggregatedData[key] = {
      'Sum of ANSWER TIMES (times)': data1[key],
      'Sum of CALL ATTEMPT TIMES (times)': data2[key],
      ASR: persont,
    };
  }

  return aggregatedData;
}

function calculateAverage(data, s) {
  const filteredData = data
    .filter(
      (item) =>
        typeof item[s] === 'string' && !item[s].toLowerCase().includes('nil'),
    )
    .map((item) => parseFloat(item[s]))
    .filter((value) => !isNaN(value)); // Ensure that the parsed value is a number

  if (filteredData.length === 0) {
    return 0; // Handle case where there are no valid values to average
  }

  const sum = filteredData.reduce((acc, value) => acc + value, 0);
  const average = sum / filteredData.length;
  return average;
}
