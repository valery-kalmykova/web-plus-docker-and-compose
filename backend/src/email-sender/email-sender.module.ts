import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailSenderService } from './email-sender.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('NODEMAILER_HOST'),
          port: configService.get('NODEMAILER_PORT'),
          secure: true,
          auth: {
            user: configService.get('NODEMAILER_USER'),
            pass: configService.get('NODEMAILER_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailSenderService],
  exports: [EmailSenderService],
})
export class EmailSenderModule {}
