import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class EmailSenderService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(wish: Wish, receivers: string[]) {
    this.mailerService.sendMail({
      to: receivers,
      from: 'valery-ish@yandex.ru',
      subject: 'Готовы купить подарок',
      html: `<p>Собраны деньги на подарок ${wish.name}, ${wish.price}, рубл.</p>
      <p>Список e-mail, готовых скинуться:</p>
      <ul>${receivers.map((item) => `<li>${item}</li>`)}</ul>`,
    });
  }
}
