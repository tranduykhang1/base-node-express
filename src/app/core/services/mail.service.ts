// create the class to send mail use node mailer

import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import envConfig from '../../../config/env.config'
import { SendMailDto } from '../dto/mail.dto'

export class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: envConfig.get('supportEmail'),
        pass: envConfig.get('supportEmailPw')
      }
    })
  }

  async sendMail(mailOptions: SendMailDto) {
    try {
      mailOptions.from = 'tranduykhang1999@gmail.com'
      return await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.log(error)
    }
  }
}
export const mailService = new MailService()
