import { Inject, Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { VisitRepository } from '../../domain/visit.repository';
import { GenerateVisitPdf } from '../generate-pdf/generate.visit.pdf';
import { EmailService } from 'src/core/infraestructure/services/email.service';
import { Payload } from '@models/payload.model';
import * as moment from 'moment';
import { formatDate } from 'src/core/infraestructure/helpers/date.helper';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class SendVisitToPrestador {
  private readonly logger = new Logger(SendVisitToPrestador.name);

  constructor(
    @Inject('PgsqlVisitRepository')
    private readonly visitRepository: VisitRepository,
    private readonly generateVisitPdf: GenerateVisitPdf,
    private readonly emailService: EmailService,
  ) {}

  async execute(visitId: string, userPayload?: Payload): Promise<{ success: boolean; message: string }> {
    try {
      // Get the visit with all its relations
      const visit = await this.visitRepository.findById(visitId);
      if (!visit) {
        throw new NotFoundException(`Visit with ID ${visitId} not found`);
      }

      // If user is not a PROGRAMADOR, validate user is the lead
      if (userPayload && userPayload.profile?.name !== 'PROGRAMADOR') {
        const isLead = visit.weekgroupVisit?.lead?.id === userPayload.sub;
        
        if (!isLead) {
          throw new ForbiddenException('Solo el líder de la visita puede enviar al prestador');
        }
      }

      // Generate the PDF
      const pdfBuffer = await this.generateVisitPdf.execute(visitId);
      if (!pdfBuffer) {
        throw new Error('Failed to generate visit PDF');
      }

      // Get prestador information for the email
      const prestador = visit.prestador;
      if (!prestador || !prestador.fiscalYearInformation || prestador.fiscalYearInformation.length === 0) {
        throw new Error('Prestador information not found for this visit');
      }

      const fiscalYearInfo = prestador.fiscalYearInformation[0];
      
      // Format date for display
      const formattedDate = visit.date ? moment(visit.date).format('DD/MM/YYYY') : 'N/A';
      
      // Load logo file for attachment
      let logoBuffer: Buffer;
      try {
        const logoPath = path.resolve(process.cwd(), 'templates/headers/gobernacionlogo.png');
        logoBuffer = fs.readFileSync(logoPath);
      } catch (error) {
        this.logger.error(`Error loading logo file: ${error.message}`);
        // Continue even if logo not found
      }
      
      // Create email HTML content with a nice design
      const emailHtml = this.generateEmailTemplate({
        representanteLegal: fiscalYearInfo.representante_legal || 'Representante Legal',
        prestadorName: fiscalYearInfo.nombre_prestador || 'Prestador',
        visitDate: formattedDate,
        codigoHabilitacion: fiscalYearInfo.codigo_habilitacion || 'N/A',
        direccion: fiscalYearInfo.direccionSede || 'N/A',
        municipio: fiscalYearInfo.municipio?.name || 'N/A',
        sade: visit.sade || 'N/A',
      });

      // Destination email - in production this would be the prestador's email
      const toEmail = process.env.NODE_ENV === 'production' 
        ? 'fabiomayorgad@hotmail.com'
        : 'fabiomayorgad@hotmail.com';

      // Prepare attachments
      const attachments = [
        {
          filename: `visita-${visitId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        }
      ];

      // Add logo if it was successfully loaded
      if (logoBuffer) {
        attachments.push({
          filename: 'gobernacionlogo.png',
          content: logoBuffer,
          contentType: 'image/png',
          cid: 'gobernacionlogo' // This cid value must match the img src in the template
        } as any); // Using type assertion to resolve linting issue
      }

      // Send the email with the PDF attached
      const emailSent = await this.emailService.sendEmail({
        to: 'fabiomayorgad@hotmail.com',//toEmail,
        subject: `Visita de Verificación - Secretaría de Salud del Valle del Cauca - SADE: ${visit.sade || 'N/A'}`,
        html: emailHtml,
        attachments
      });

      if (!emailSent) {
        throw new Error('Failed to send email to prestador');
      }

      // Log the visitId and the current state of the visit
       await this.visitRepository.updateNotificationSended(visitId);

      return { 
        success: true, 
        message: `Notification email sent successfully to ${toEmail}` 
      };
    } catch (error) {
      this.logger.error(`Error sending visit notification for ID ${visitId}:`, error);
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  /**
   * Generates a nicely formatted HTML email template
   */
  private generateEmailTemplate(data: {
    representanteLegal: string;
    prestadorName: string;
    visitDate: string;
    codigoHabilitacion: string;
    direccion: string;
    municipio: string;
    sade: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Notificación de Visita - Secretaría de Salud</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            background-color: #f9f9f9;
          }
          .container {
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #005baa 0%, #004a8c 100%);
            color: white;
            padding: 25px 20px;
            text-align: center;
          }
          .header img {
            max-width: 100%;
            height: auto;
            margin-bottom: 10px;
          }
          .header h1 {
            margin: 10px 0;
            font-size: 24px;
          }
          .header h3 {
            margin: 5px 0;
            font-weight: 500;
            letter-spacing: 0.5px;
          }
          .content {
            padding: 30px;
            background-color: #fff;
            border-left: 1px solid #e1e1e1;
            border-right: 1px solid #e1e1e1;
          }
          .content p {
            margin-bottom: 15px;
            font-size: 15px;
          }
          .footer {
            background-color: #f3f3f3;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 3px solid #005baa;
          }
          h2 {
            color: #005baa;
            border-bottom: 2px solid #eaeaea;
            padding-bottom: 10px;
            margin-top: 30px;
            font-size: 20px;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .info-table th, .info-table td {
            border: 1px solid #e1e1e1;
            padding: 12px;
          }
          .info-table th {
            background-color: #f5f7fa;
            text-align: left;
            color: #005baa;
            font-weight: 600;
            width: 35%;
          }
          .info-table tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .highlight {
            font-weight: 600;
            color: #005baa;
            background-color: #f0f7ff;
            padding: 2px 5px;
            border-radius: 3px;
          }
          .recipient {
            background-color: #f5f7fa;
            padding: 15px;
            border-left: 4px solid #005baa;
            margin-bottom: 20px;
            border-radius: 0 5px 5px 0;
          }
          .recipient p {
            margin: 5px 0;
          }
          .important-notice {
            background-color: #fff8e1;
            border-left: 4px solid #ffc107;
            padding: 10px 15px;
            margin-top: 20px;
            border-radius: 0 5px 5px 0;
          }
          .reminder {
            background-color: #e8f4fd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://datalake.valledelcauca.gov.co/assets/logo-servinformacion-negativo-1x.png" alt="Gobernación del Valle del Cauca - Secretaría de Salud" />
            <h1>Secretaría de Salud Departamental del Valle del Cauca</h1>
            <h3>Notificación Oficial de Visita de Verificación</h3>
          </div>
          
          <div class="content">
            <div class="recipient">
              <p>Señor(a):</p>
              <p><strong>${data.representanteLegal}</strong></p>
              <p><strong>Representante Legal</strong></p>
              <p><strong>${data.prestadorName}</strong></p>
            </div>
            
            <p>Cordial saludo,</p>
            
            <p>Por medio de la presente, le informamos que se ha programado una <span class="highlight">Visita de Verificación de Condiciones de Habilitación - Certificación derivada del Plan Anual de Visitas</span> para el día <span class="highlight">${data.visitDate}</span>.</p>
            
            <h2>Información de la Visita</h2>
            
            <table class="info-table">
              <tr>
                <th>SADE</th>
                <td>${data.sade}</td>
              </tr>
              <tr>
                <th>Código de Habilitación</th>
                <td>${data.codigoHabilitacion}</td>
              </tr>
              <tr>
                <th>Fecha de Visita</th>
                <td>${data.visitDate}</td>
              </tr>
              <tr>
                <th>Dirección</th>
                <td>${data.direccion}</td>
              </tr>
              <tr>
                <th>Municipio</th>
                <td>${data.municipio}</td>
              </tr>
            </table>
            
            <p>En el archivo adjunto encontrará la comunicación oficial con información detallada sobre la visita y los documentos que deberá tener disponibles.</p>
            
            <div class="reminder">
              <p>Le recordamos que es importante que disponga del equipo humano y las medidas de bioseguridad, así como de la información que deba ser aportada, en medio físico y/o magnético, organizada por estándar y de acuerdo con lo requerido en la normatividad vigente.</p>
            </div>
            
            <p>Agradecemos de antemano su disposición para que la visita se desarrolle de manera adecuada y oportuna.</p>
            
            <div class="important-notice">
              <p><strong>IMPORTANTE</strong>: Este correo es generado automáticamente, por favor no responda a esta dirección.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Grupo de Inspección, Vigilancia y Control de la Secretaría Departamental de Salud del Valle del Cauca</p>
            <p>© ${new Date().getFullYear()} Gobernación del Valle del Cauca. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
} 