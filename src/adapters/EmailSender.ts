import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const emailSender = {
  async sendEmail(email: string, confirmationCode: string): Promise<SMTPTransport.SentMessageInfo> {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'incubatorForTest@gmail.com',
        pass: 'sautourezxihtlmk',
      },
    });

    return await transport.sendMail({
      from: '"Marcos" <incubatorForTest@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Email confirmation',
      html: `<a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>`, // html body
    });
  },
};
