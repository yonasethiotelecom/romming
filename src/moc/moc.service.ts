import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as ftp from 'basic-ftp';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class MocService {
  constructor(private readonly prisma: PrismaService) {}
  @Cron('0 57 * * * *')
  async readAllCsvFilesrFomFtpServer(): Promise<any[]> {
    const client = new ftp.Client();

    try {
      await client.access({
        host: `${process.env.ftp_Ip}`,
        user: `${process.env.ftp_user}`,
        password: `${process.env.ftp_password}`,
        secure: false, // Set to true if you're using FTPS
      });

      const remoteDirectory = '/Moc/day'; // Specify the remote directory path here
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
              'Connection Type': data[3],
              'CONNECTED RATIO (%)': data[4],
              'ANSWER TIMES (times)': data[5],
              'CALL ATTEMPT TIMES (times)': data[6],
            };
            if (Number(formattedDataH['Period (min)'])) {
              fileResultsNew.push(formattedDataH);
            }

            //  console.log('data', data);
          }

          const aggregatedDataAns = aggregateSite(
            fileResultsNew,
            'ANSWER TIMES (times)',
          );

          const aggregatedDataGA_Att = aggregateSite(
            fileResultsNew,
            'CALL ATTEMPT TIMES (times)',
          );

          const ASR = aggregateData(aggregatedDataAns, aggregatedDataGA_Att);

          console.log(aggregatedDataAns);
          console.log(aggregatedDataGA_Att);

          //prisma

          let existingfileName = await this.prisma.fileName.findUnique({
            where: { name: file.name + 'day' },
            select: { id: true },
          });

          if (!existingfileName) {
            existingfileName = await this.prisma.fileName.create({
              data: {
                name: file.name + 'day',
              },
              select: { id: true },
            });

            await this.prisma.moc_Asr.create({
              data: {
                ASR: convertToList(ASR),
                shift: 'day',
                fileId: existingfileName.id,
              },
            });
          }

          const fileObject = {
            fileName: file.name + 'day',
            ASR: convertToList(ASR),
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

  data.forEach((item) => {
    const site = item['NE Name'];

    // console.log('sta' + site);
    const amount = parseFloat(item[s]);

    //  console.log('amo' + amount);
    if (aggregated[site]) {
      aggregated[site] += amount;
    } else {
      aggregated[site] = amount;
    }
  });

  return aggregated;
}

function aggregateData(data1, data2) {
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
function convertToList(dataDict) {
  return Object.entries(dataDict)
    .map(([key, value], index) => {
      const node = key.replace(/^.*?MSC_/, 'MSC_');
      return {
        id: index + 1, // Adding 1 to start IDs from 1
        node: node,
        'Sum of ANSWER TIMES (times)': value['Sum of ANSWER TIMES (times)'],
        'Sum of CALL ATTEMPT TIMES (times)':
          value['Sum of CALL ATTEMPT TIMES (times)'],
        ASR: value['ASR'],
      };
    })
    .sort((a, b) => {
      const regex = /MSC_(\d+)/;
      const numberA = parseInt(a.node.match(regex)[1]);
      const numberB = parseInt(b.node.match(regex)[1]);
      return numberA - numberB;
    });
}
