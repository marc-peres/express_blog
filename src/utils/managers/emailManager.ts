import { emailSender } from '../../adapters/EmailSender';
import { InputPostUsersWithPasswordHashType } from '../../modules/users/models/input';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const emailManager = {
  async sendEmailRecoveryMessage(user: InputPostUsersWithPasswordHashType): Promise<SMTPTransport.SentMessageInfo> {
    const { email, emailConfirmation } = user;
    const { confirmationCode } = emailConfirmation!;
    return await emailSender.sendEmail(email, confirmationCode!);
  },
};
