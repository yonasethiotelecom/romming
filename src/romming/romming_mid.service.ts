import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as ftp from 'basic-ftp';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';

@Injectable()
export class RommingMidService {
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

      const remoteDirectory = '/InternationalRoaming/middle-day'; // Specify the remote directory path here
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
              'Number of IMSI Attached International Roaming Subscribers in 2G LAI (entries)':
                data[4],
              'Nuber mof IMSI Attached International Roaming Subscribers in 3G LAI (entries)':
                data[5],
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

          const aggregatedData2GA_Roaming2G = aggregateSite(
            fileResults2G,
            'Number of IMSI Attached International Roaming Subscribers in 2G LAI (entries)',
          );

          const aggregatedData2GA_Roaming3G = aggregateSite(
            fileResults2G,
            'Nuber mof IMSI Attached International Roaming Subscribers in 3G LAI (entries)',
          );

          const aggregatedData3GA_Roaming2G = aggregateSite(
            fileResults3G,
            'Number of IMSI Attached International Roaming Subscribers in 2G LAI (entries)',
          );
          const aggregatedData3GA_Roaming3G = aggregateSite(
            fileResults3G,
            'Nuber mof IMSI Attached International Roaming Subscribers in 3G LAI (entries)',
          );

          // Calling the function
          const groupedAmounts = groupAmountsByStarttime(fileResults2G);
          console.log(groupedAmounts);
          const filteredAmountsAA = transformJson2G(
            collectorAA(groupedAmounts),
          );
          const filteredAmountsNR = transformJson2G(
            collectorNR(groupedAmounts),
          );
          const filteredAmountsER = transformJson2G(
            collectorER(groupedAmounts),
          );
          const filteredAmountsSSWR = transformJson2G(
            collectorSSWR(groupedAmounts),
          );
          const AllAverage2G = combineMultipleJSON([
            filteredAmountsAA,
            filteredAmountsNR,
            filteredAmountsER,
            filteredAmountsSSWR,
          ]);

          const groupedAmounts3G = groupAmountsByStarttime(fileResults3G);
          console.log(groupedAmounts);

          const filteredAmountsAA3G = transformJson3G(
            collectorAA(groupedAmounts3G),
          );
          const filteredAmountsNR3G = transformJson3G(
            collectorNR(groupedAmounts3G),
          );
          const filteredAmountsER3G = transformJson3G(
            collectorER(groupedAmounts3G),
          );
          const filteredAmountsSSWR3G = transformJson3G(
            collectorSSWR(groupedAmounts3G),
          );
          const AllAverage3G = combineMultipleJSON([
            filteredAmountsAA3G,
            filteredAmountsNR3G,
            filteredAmountsER3G,
            filteredAmountsSSWR3G,
          ]);
          //prisma

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

            await this.prisma.sumOfAverages2G.create({
              data: {
                Averages2G: aggregatedData2GA_Roaming2G as number,
                shift: 'mid',
                fileId: existingfileName.id,
              },
            });
            await this.prisma.sumOfAverages3G.create({
              data: {
                Averages3G: aggregatedData3GA_Roaming3G as number,
                shift: 'mid',
                fileId: existingfileName.id,
              },
            });

            await this.prisma.inboundRoamer2G.create({
              data: {
                AA_MSCS: filteredAmountsAA,
                NR_MSCS: filteredAmountsNR,
                ER_MSCS: filteredAmountsER,
                SSWR_MSCS: filteredAmountsSSWR,
                AllAverage: AllAverage2G,
                shift: 'mid',
                fileId: existingfileName.id,
              },
            });

            await this.prisma.inboundRoamer3G.create({
              data: {
                AA_MSCS: filteredAmountsAA3G,
                NR_MSCS: filteredAmountsNR3G,
                ER_MSCS: filteredAmountsER3G,
                SSWR_MSCS: filteredAmountsSSWR3G,
                AllAverage: AllAverage3G,
                shift: 'mid',
                fileId: existingfileName.id,
              },
            });
          }

          const fileObject = {
            fileName: file.name + 'mid',
            AllAverage2G: AllAverage2G,
            AllAverage3G: AllAverage3G,
            aggregatedData2GA_Roaming2G: aggregatedData2GA_Roaming2G,

            aggregatedData3GA_Roaming3G: aggregatedData3GA_Roaming3G,

            filteredAmountsAA: filteredAmountsAA,
            filteredAmountsNR: filteredAmountsNR,
            filteredAmountsER: filteredAmountsER,
            filteredAmountsSSWR: filteredAmountsSSWR,
            filteredAmountsAA3G: filteredAmountsAA3G,
            filteredAmountsNR3G: filteredAmountsNR3G,
            filteredAmountsER3G: filteredAmountsER3G,
            filteredAmountsSSWR3G: filteredAmountsSSWR3G,
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

  return sum;
}
function groupAmountsByStarttime(data: any[]): any {
  const groupedData: any = {};

  data.forEach((item) => {
    const neName = item['NE Name'];
    const time = item['Start Time'];
    const row4 =
      item[
        'Number of IMSI Attached International Roaming Subscribers in 2G LAI (entries)'
      ];
    const row5 =
      item[
        'Nuber mof IMSI Attached International Roaming Subscribers in 3G LAI (entries)'
      ];

    if (!groupedData[neName]) {
      groupedData[neName] = [];
    }
    const temp = [time, row4, row5];

    groupedData[neName].push(temp);
  });

  const output = {};

  for (const siteName in groupedData) {
    const siteData = groupedData[siteName];
    output[siteName] = {};

    siteData.forEach((entry) => {
      const [time, total1, total2] = entry;
      if (!output[siteName][time]) {
        output[siteName][time] = { total1: 0, total2: 0 };
      }
      output[siteName][time].total1 += parseInt(total1) || 0;
      output[siteName][time].total2 += parseInt(total2) || 0;
    });
  }
  return output;
}

function collectorAA(groupedAmounts: { [key: string]: any }) {
  const AA_MSCs = Object.keys(groupedAmounts)
    .filter((key) => {
      return key.endsWith('AA') && !key.endsWith('WAAZ.AA');
    })
    .reduce((result, key) => {
      result[key] = groupedAmounts[key];
      return result;
    }, {});

  return calculateAverageValues(AA_MSCs) || {};
}

function collectorNR(groupedAmounts: { [key: string]: any }) {
  const NR_MSCs = Object.keys(groupedAmounts)
    .filter((key) => {
      return (
        key.endsWith('NR') ||
        key.endsWith('NER') ||
        key.endsWith('NWR') ||
        key.endsWith('NNWR') ||
        key.endsWith('WAAZ.AA')
      );
    })
    .reduce((result, key) => {
      result[key] = groupedAmounts[key];
      return result;
    }, {});

  return calculateAverageValues(NR_MSCs) || {};
}

function collectorER(groupedAmounts: { [key: string]: any }) {
  const ER_MSCs = Object.keys(groupedAmounts)
    .filter((key) => {
      return key.endsWith('ER');
    })
    .reduce((result, key) => {
      result[key] = groupedAmounts[key];
      return result;
    }, {});

  return calculateAverageValues(ER_MSCs) || {};
}

function collectorSSWR(groupedAmounts: { [key: string]: any }) {
  const SSWR_MSCs = Object.keys(groupedAmounts)
    .filter((key) => {
      return key.endsWith('SSWR');
    })
    .reduce((result, key) => {
      result[key] = groupedAmounts[key];
      return result;
    }, {});

  return calculateAverageValues(SSWR_MSCs) || {};
}

function calculateAverageValues(filteredAmounts: any): any {
  const elementsToAverage = Object.keys(filteredAmounts);
  const timeElements = Object.keys(filteredAmounts[elementsToAverage[0]]);
  const averageValues: any = {};

  for (const timeElement of timeElements) {
    let total1sum = 0;
    let total2sum = 0;

    for (const element of elementsToAverage) {
      total1sum += filteredAmounts[element][timeElement]['total1'];
      total2sum += filteredAmounts[element][timeElement]['total2'];
    }

    const total1average = total1sum / elementsToAverage.length;
    const total2average = total2sum / elementsToAverage.length;

    averageValues[timeElement] = {
      total1average,
      total2average,
    };
  }

  return averageValues;
}
function transformJson2G(data) {
  let id = 'date';
  let color = 'color';

  const obj = Object.keys(data).map((key) => {
    const [date, time] = key.split(' ');
    id = date;
    color = getColorCode(date);
    return {
      x: time,
      y: data[key].total1average,
    };
  });
  return { id: id, color: color, data: obj };
}

function transformJson3G(data) {
  let id = 'date';
  let color = 'color';

  const obj = Object.keys(data).map((key) => {
    const [date, time] = key.split(' ');
    id = date;
    color = getColorCode(date);
    return {
      x: time,
      y: data[key].total2average,
    };
  });
  return { id: id, color: color, data: obj };
}

function combineMultipleJSON(jsonList) {
  const combinedData = [];

  jsonList.forEach((json) => {
    json.data.forEach((dataPoint) => {
      const existingPoint = combinedData.find(
        (point) => point.x === dataPoint.x,
      );
      if (existingPoint) {
        existingPoint.y += dataPoint.y;
      } else {
        combinedData.push({ x: dataPoint.x, y: dataPoint.y });
      }
    });
  });

  return {
    id: jsonList[0].id,
    color: jsonList[0].color,
    data: combinedData,
  };
}

/* function getColorCode(date) {
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
 */

function getColorCode(date) {
  const dateObj = new Date(date);
  const month = dateObj.getMonth(); // 0 (Jan) to 11 (Dec)
  const day = dateObj.getDate(); // 1 to 31

  // Base hues for each month (12 months)
  const baseHues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  // Get the base hue for the month
  const monthHue = baseHues[month];

  // Adjust the hue based on the day to ensure uniqueness
  const dayAdjustment = day * 2; // Adjust by 2 degrees per day

  // Calculate the final hue
  const finalHue = (monthHue + dayAdjustment) % 360;

  // Return the HSL color code
  return `hsl(${finalHue}, 70%, 50%)`;
}
