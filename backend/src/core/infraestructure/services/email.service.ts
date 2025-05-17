import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize the nodemailer transporter
    // In a production environment, you'd want to use a proper SMTP service
    // For development, we'll use the ethereal email service for testing
    this.createTransporter();
  }

  private async createTransporter() {
    try {
      // Create a test account using Ethereal for development/testing
      // In production, use environment variables to store actual SMTP credentials
      const testAccount = await nodemailer.createTestAccount();

      this.transporter = createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || testAccount.user,
          pass: process.env.SMTP_PASS || testAccount.pass,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      this.logger.log('Email transporter created successfully');
    } catch (error) {
      this.logger.error('Failed to create email transporter', error);
      throw error;
    }
  }

  /**
   * Send an email with optional attachments
   */
  async sendEmail(options: {
    from?: string;
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    attachments?: Array<{
      filename: string;
      content?: Buffer;
      path?: string;
      cid?: string;
      contentType?: string;
    }>;
  }): Promise<boolean> {
    try {
      const { from, to, subject, html, text, attachments } = options;

      const mailOptions = {
        from: from || process.env.SMTP_FROM || 'Secretaría de Salud <salud@valledelcauca.gov.co>',
        to,
        subject,
        text,
        html,
        attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // Log email preview URL (only works with Ethereal)
      if (info.messageId) {
        this.logger.log(`Email sent: ${info.messageId}`);
        if (nodemailer.getTestMessageUrl(info)) {
          this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      this.logger.error('Failed to send email', error);
      return false;
    }
  }
} 