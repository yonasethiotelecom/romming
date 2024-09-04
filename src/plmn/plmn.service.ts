import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as ftp from 'basic-ftp';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';

@Injectable()
export class PlmnService {
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

      const remoteDirectory = '/PlmnNum'; // Specify the remote directory path here
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

          const fileResultsNew: any[] = [];
          for await (const data of csvStream) {
            const formattedDataH = {
              'Start Time': data[0],
              'Period (min)': data[1],
              'NE Name': data[2],
              PLMN: data[3],
              'Gb mode attached user number per PLMN (number)': data[4],
              'Gb mode realtime users with act PDP context per PLMN (number)':
                data[5],
              'Gb mode downlink data volume in a PLMN (MB)': data[6],
              'Gb mode uplink data volume in a PLMN (MB)': data[7],
              'Iu mode attached user number per PLMN (number)': data[8],
              'Iu mode realtime users with act PDP context per PLMN (number)':
                data[9],
              'Iu mode downlink data volume in a PLMN (MB)': data[10],
              'Iu mode uplink data volume in a PLMN (MB)': data[11],
              'S1 Mode Real Rime Attached Users per PLMN (number)': data[12],
              'S1 Mode Real Time PDN Connection Number per PLMN (number)':
                data[13],
            };
            if (
              Number(formattedDataH['Period (min)']) &&
              !formattedDataH.PLMN.toLowerCase().includes('=636')
            ) {
              fileResultsNew.push(formattedDataH);
            }
          }
          //console.log('data', fileResultsNew);

          const sumGbA = aggregateSite(
            fileResultsNew,
            'Gb mode attached user number per PLMN (number)',
          );
          const sumGbR = aggregateSite(
            fileResultsNew,
            'Gb mode realtime users with act PDP context per PLMN (number)',
          );
          const sumS1A = aggregateSite(
            fileResultsNew,
            'S1 Mode Real Rime Attached Users per PLMN (number)',
          );
          const sumS1R = aggregateSite(
            fileResultsNew,
            'S1 Mode Real Time PDN Connection Number per PLMN (number)',
          );

          const sumIuA = aggregateSite(
            fileResultsNew,
            'Iu mode attached user number per PLMN (number)',
          );
          const sumIuR = aggregateSite(
            fileResultsNew,
            'Iu mode realtime users with act PDP context per PLMN (number)',
          );

          /////////////////////7/////////////
          const sumGbD = aggregateSite(
            fileResultsNew,
            'Gb mode downlink data volume in a PLMN (MB)',
          );

          const sumGbU = aggregateSite(
            fileResultsNew,
            'Gb mode uplink data volume in a PLMN (MB)',
          );

          const sumIuD = aggregateSite(
            fileResultsNew,
            'Iu mode downlink data volume in a PLMN (MB)',
          );

          const sumIUU = aggregateSite(
            fileResultsNew,
            'Iu mode uplink data volume in a PLMN (MB)',
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
            sumGbA: sumGbA,
            sumGbR: sumGbR,
            sumS1A: sumS1A,
            sumS1R: sumS1R,
            sumIuA: sumIuA,
            sumIuR: sumIuR,
//number 7
            sumGbD: sumGbD,
            sumGbU: sumGbU,
            sumIuD: sumIuD,
            sumIUU: sumIUU,
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
    const site = item['Start Time'];

    const value = item[s].toLowerCase(); // Convert to lowercase
    const searchString = 'nil';

    if (value.includes(searchString.toLowerCase())) {
      return; // Skip iteration when the value contains 'nil' (case-insensitive)
    }

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
