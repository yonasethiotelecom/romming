import { Module } from '@nestjs/common';

import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FtpModule } from './ftp/ftp.module';
import { EmailModule } from './email/email.module';
import { PrismaModule } from './prisma/prisma.module';
import { VoiceModule } from './voice/voice.module';
import { RommingModule } from './romming/romming.module';
import { MocModule } from './moc/moc.module';
import { MtcModule } from './mtc/mtc.module';
import { SrModule } from './sr/sr.module';
import { PlmnModule } from './plmn/plmn.module';
import { VolumeModule } from './volume/volume.module';
import { PerformanceModule } from './performance/performance.module';
import { RommingReadingModule } from './romming_reading/romming_reading.module';
import { VoiceReadingModule } from './voice_reading/voice_reading.module';
import { MocReadingModule } from './moc_reading/moc_reading.module';
import { MtcReadingModule } from './mtc_reading/mtc_reading.module';
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from './auth/guards/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AbilityModule } from './ability/ability.module';
import { MocService } from './moc/moc.service';
import { NoteModule } from './note/note.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PrismaModule,
    FtpModule,
    AuthModule,
    EmailModule,
    VoiceModule,
    RommingModule,
    MocModule,
    MtcModule,
    SrModule,
    PlmnModule,
    VolumeModule,
    PerformanceModule,
    RommingReadingModule,
    VoiceReadingModule,
    MocReadingModule,
    MtcReadingModule,
    ConfigModule.forRoot(),
    UsersModule,
    AbilityModule,
    NoteModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    AppService,
    MocService,
  ],
})
export class AppModule {}
