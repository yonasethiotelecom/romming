import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  async sendEmail(): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your_email@gmail.com',
        pass: 'your_email_password',
      },
    });

    const mailOptions = {
      from: 'yonas.mulugetat@ethiotelecom.et',
      to: 'yonas.mulugetat@ethiotelecom.et',
      subject: 'Test Email',
      text: 'Hello, this is a test email!',
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      throw new Error(`Failed to send email: ${error}`);
    }
  }
}
