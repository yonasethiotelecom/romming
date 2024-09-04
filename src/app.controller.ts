import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
//import { FtpService } from './ftp/ftp.service';
import { EmailService } from './email/email.service';
import { VoiceService } from './voice/voice.service';
import { MocService } from './moc/moc.service';
import { MocMidService } from './moc/moc_mid.service';
import { MocNightService } from './moc/moc_night.service';

import { MtcService } from './mtc/mtc.service';
import { SrService } from './sr/sr.service';
import { PlmnService } from './plmn/plmn.service';
import { VolumeService } from './volume/volume.service';
import { PerformanceService } from './performance/performance.service';
import { RommingService } from './romming/romming.service';
import { Public } from './public.decorator';
import { MtcMidService } from './mtc/mtc_mid.service';
import { MtcNightService } from './mtc/mtc_night.service';
import { RommingMidService } from './romming/romming_mid.service';
import { RommingNightService } from './romming/romming_night.service';
import { VoiceMidService } from './voice/voice_mid.service';
import { VoiceNightService } from './voice/voice_night.service';

@Public()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailService: EmailService,
    // private readonly ftpService: FtpService,
    private readonly rommingService: RommingService,
    private readonly rommingMidService: RommingMidService,
    private readonly rommingNightService: RommingNightService,

    private readonly voiceService: VoiceService,
    private readonly voiceMidService: VoiceMidService,
    private readonly voiceNightService: VoiceNightService,

    private readonly mocService: MocService,
    private readonly mocMidService: MocMidService,
    private readonly mocNightService: MocNightService,

    private readonly mtcMidService: MtcMidService,
    private readonly mtcNightService: MtcNightService,
    private readonly mtcService: MtcService,
    private readonly srService: SrService,
    private readonly plmnService: PlmnService,
    private readonly volumeService: VolumeService,
    private readonly performanceService: PerformanceService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('csv-json1')
  async readCsvFile1(): Promise<any[]> {
    return this.rommingService.readAllCsvFilesrFomFtpServer();
  }
  @Get('csv-json11')
  async readCsvFile11(): Promise<any[]> {
    return this.rommingMidService.readAllCsvFilesrFomFtpServer();
  }
  @Get('csv-json111')
  async readCsvFile111(): Promise<any[]> {
    return this.rommingNightService.readAllCsvFilesrFomFtpServer();
  }

  @Get('csv-json2')
  async readCsvFile2(): Promise<any[]> {
    return this.voiceService.readAllCsvFilesrFomFtpServer();
  }
  @Get('csv-json22')
  async readCsvFile22(): Promise<any[]> {
    return this.voiceMidService.readAllCsvFilesrFomFtpServer();
  }
  @Get('csv-json222')
  async readCsvFile222(): Promise<any[]> {
    return this.voiceNightService.readAllCsvFilesrFomFtpServer();
  }
  @Get('csv-json3')
  async readCsvFile3(): Promise<any[]> {
    return this.mocService.readAllCsvFilesrFomFtpServer();
  }
  @Get('csv-json33')
  async readCsvFile33(): Promise<any[]> {
    return this.mocMidService.readAllCsvFilesrFomFtpServer();
  }
  @Get('csv-json333')
  async readCsvFile333(): Promise<any[]> {
    return this.mocNightService.readAllCsvFilesrFomFtpServer();
  }
  @Get('csv-json4')
  async readCsvFile4(): Promise<any[]> {
    return this.mtcService.readAllCsvFilesrFomFtpServer();
  }
  @Get('csv-json44')
  async readCsvFile44(): Promise<any[]> {
    return this.mtcMidService.readAllCsvFilesrFomFtpServer();
  }
  @Get('csv-json444')
  async readCsvFile444(): Promise<any[]> {
    return this.mtcNightService.readAllCsvFilesrFomFtpServer();
  }
  @Get('csv-json5')
  async readCsvFile5(): Promise<any[]> {
    return this.srService.readAllCsvFilesrFomFtpServer();
  }
  @Get('csv-json6')
  async readCsvFile6(): Promise<any[]> {
    return this.plmnService.readAllCsvFilesrFomFtpServer();
  }
  @Get('csv-json7')
  async readCsvFile7(): Promise<any[]> {
    return this.volumeService.readAllCsvFilesrFomFtpServer();
  }
  @Get('csv-json8')
  async readCsvFile(): Promise<any[]> {
    return this.performanceService.readAllCsvFilesrFomFtpServer();
  }
  @Get('send')
  async sendEmail(): Promise<string> {
    await this.emailService.sendEmail();
    return 'Email sent successfully';
  }
}
