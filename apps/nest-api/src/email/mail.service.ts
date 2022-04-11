import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {

  constructor (private mailerService: MailerService) {}

  async sendMail(email: string, username: string, link) {
    await this.mailerService.sendMail({
        to: email,
        subject: 'Greeting from NestJS NodeMailer',
        template: '/email',
        context: {
            username,
            link
        }
    })
}

}