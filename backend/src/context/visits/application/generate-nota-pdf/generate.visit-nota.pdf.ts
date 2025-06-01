import { Inject, Injectable, Logger } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { VisitNotaRepository } from '../../domain/visit-nota.repository';

@Injectable()
export class GenerateVisitNotaPdf {
    private readonly logger = new Logger(GenerateVisitNotaPdf.name);
    private currentVisitNota: any;
    private headerPath: string;
    private footerPath: string;

    constructor(
        @Inject('PgsqlVisitNotaRepository')
        private readonly visitNotaRepository: VisitNotaRepository,
    ) {
        // Initialize paths on constructor
        this.headerPath = path.resolve(process.cwd(), 'templates/headers/gobernacionlogo.png');
        this.footerPath = path.resolve(process.cwd(), 'templates/footers/footer.png');
    }

    async execute(id: string): Promise<Buffer | null> {
        try {
            // Fetch the visit nota data from the repository
            const visitNota = await this.visitNotaRepository.findById(id);

            if (!visitNota) {
                this.logger.error(`Visit nota with ID ${id} not found`);
                return null;
            }

            // Generate PDF using PDFKit
            const pdfBuffer = await this.generatePdf(visitNota);

            return pdfBuffer;
        } catch (error) {
            this.logger.error(`Error generating PDF for visit nota ${id}:`, error);
            throw error;
        }
    }

    private async generatePdf(visitNota: any): Promise<Buffer> {
        // Store current visit nota for use in header
        this.currentVisitNota = visitNota;

        // Create a document with A4 size
        const doc = new PDFDocument({
            autoFirstPage: false,
            size: 'A4',
            margins: {
                top: 165, // Increased top margin to accommodate header
                left: 50,
                bottom: 70,
                right: 50
            },
            info: {
                Title: `Nota Aclaratoria ${visitNota.acta_number}`,
                Author: 'Secretaría de Salud del Valle del Cauca',
                Subject: 'Nota Aclaratoria de Visita de Verificación',
            }
        });

        // Register Arial fonts
        this.registerFonts(doc);

        // Buffer to store PDF data
        const buffers: Buffer[] = [];
        doc.on('data', (chunk) => buffers.push(chunk));

        this.logger.log(`Using header image from: ${this.headerPath}`);
        this.logger.log(`Using footer image from: ${this.footerPath}`);

        // Set up event listener for new pages to add header and footer automatically
        doc.on('pageAdded', () => {
            this.addHeaderAndFooter(doc);
        });

        // Create the first page (header and footer will be added by the pageAdded event)
        doc.addPage();

        // Start with date information
        doc.font('Arial')
            .text(`Santiago de Cali, ${this.formatDate(new Date())}`, 50, 180);

        // Add document content
        this.addRecipientInfo(doc, visitNota.visit);
        this.addSubject(doc, visitNota);
        this.addMainContent(doc, visitNota);
        this.addSignature(doc, visitNota);

        // Finalize the PDF
        doc.end();

        // Return a promise that resolves with the PDF buffer
        return new Promise((resolve) => {
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
        });
    }

    private registerFonts(doc: PDFKit.PDFDocument) {
        try {
            // Font paths
            const arialRegularPath = path.resolve(process.cwd(), 'templates/fonts/arial.ttf');
            const arialBoldPath = path.resolve(process.cwd(), 'templates/fonts/arialbd.ttf');

            // Check if font files exist and have a minimum size to be valid TTF files
            if (
                fs.existsSync(arialRegularPath) &&
                fs.existsSync(arialBoldPath) &&
                fs.statSync(arialRegularPath).size > 1000 &&
                fs.statSync(arialBoldPath).size > 1000
            ) {
                // Register fonts with PDFKit
                doc.registerFont('Arial', arialRegularPath);
                doc.registerFont('Arial-Bold', arialBoldPath);
                this.logger.log('Arial fonts registered successfully');
            } else {
                // If files don't exist or are placeholder files, log instructions and fall back
                this.logger.warn('Valid Arial font files not found');
                this.logger.warn('To use Arial fonts:');
                this.logger.warn('1. Download Arial TTF files (arial.ttf and arialbd.ttf)');
                this.logger.warn('2. Place them in the templates/fonts directory');
                this.logger.warn('3. Restart the application');
                this.fallbackToHelvetica(doc);
            }
        } catch (error) {
            this.logger.error(`Error registering fonts: ${error.message}`);
            this.fallbackToHelvetica(doc);
        }
    }

    private fallbackToHelvetica(doc: PDFKit.PDFDocument) {
        this.logger.log('Falling back to Helvetica fonts');
        // Use PDFKit's default Helvetica fonts as fallback
        doc.registerFont('Arial', 'Helvetica');
        doc.registerFont('Arial-Bold', 'Helvetica-Bold');
    }

    private addHeaderAndFooter(doc: PDFKit.PDFDocument) {
        // Save current cursor position
        const currentY = doc.y;
        const currentX = doc.x;

        // Save current font and font size
        const currentFont = (doc as any)._font ? (doc as any)._font.name : 'Arial';
        const currentFontSize = (doc as any)._fontSize || 12;

        // Add header image at the top of the page
        try {
            doc.image(this.headerPath, 50, 20, {
                width: 500,
                align: 'center'
            });
            this.logger.log('Successfully added header image to PDF');

            // Add document information text right below the header image
            doc.font('Arial')
                .fontSize(12)
                .text('FO-M9-P3-02- V04', 50, 110);

            doc.moveDown();
            doc.text(`1.220.20-38.108 – ${this.currentVisitNota?.visit?.sade || 'N/A'}`);

            doc.moveDown();

        } catch (error) {
            this.logger.error(`Error adding header image to PDF: ${error.message}`);
        }

        // Add footer image at the bottom of the page
        try {
            // The footer image should be positioned at the bottom of the page
            doc.image(this.footerPath, 50, 760, {
                width: 500,
                align: 'center'
            });
            this.logger.log('Successfully added footer image to PDF');
        } catch (error) {
            this.logger.error(`Error adding footer image to PDF: ${error.message}`);
        }

        // Restore cursor position to continue adding content
        doc.x = currentX;
        doc.y = currentY;

        // Restore original font and font size
        doc.font(currentFont).fontSize(currentFontSize);
    }

    private addRecipientInfo(doc: PDFKit.PDFDocument, visit: any) {
        const startY = doc.y + 20;

        doc.font('Arial')
            .fontSize(12)
            .text('Señor (a)', 50, startY);

        doc.font('Arial')
            .text(visit.prestador?.fiscalYearInformation[0]?.representante_legal || 'N/A');

        doc.font('Arial')
            .text('Representante Legal');

        doc.font('Arial')
            .text(visit.prestador?.fiscalYearInformation[0]?.nombre_prestador || 'N/A');

        doc.font('Arial')
            .text(visit.prestador?.fiscalYearInformation[0]?.direccionSede || 'N/A');

        doc.font('Arial')
            .text(visit.prestador?.fiscalYearInformation[0]?.municipio.name || 'N/A');

        doc.font('Arial')
            .text(visit.prestador?.fiscalYearInformation[0]?.correoSede || 'N/A');

        doc.font('Arial')
            .text(visit.prestador?.fiscalYearInformation[0]?.correoRepresentante || 'N/A');
    }

    private addSubject(doc: PDFKit.PDFDocument, visitNota: any) {
        const startY = doc.y + 20;

        doc.font('Arial-Bold')
            .fontSize(12)
            .text(`Asunto: NOTA ACLARATORIA - ${visitNota.type.toUpperCase()} No. ${visitNota.acta_number}`, 50, startY, {
                width: 500,
                align: 'left'
            });
    }

    private addMainContent(doc: PDFKit.PDFDocument, visitNota: any) {
        const startY = doc.y + 20;

        doc.font('Arial')
            .fontSize(12)
            .text('Cordial saludo:', 50, startY);

        doc.moveDown();

        // Add justification
        doc.font('Arial-Bold')
            .text('Justificación:');
        
        doc.font('Arial')
            .text(visitNota.justification, {
                width: 500,
                align: 'justify'
            });

        doc.moveDown(2);

        // Add the main content (rich text body)
        doc.font('Arial-Bold')
            .text('Contenido:');

        doc.moveDown();

        // Convert HTML to plain text for PDF (basic conversion)
        const plainTextContent = this.convertHtmlToPlainText(visitNota.body);
        
        doc.font('Arial')
            .text(plainTextContent, {
                width: 500,
                align: 'justify'
            });
    }

    private addSignature(doc: PDFKit.PDFDocument, visitNota: any) {
        doc.moveDown(3);

        doc.font('Arial')
            .fontSize(12)
            .text('Atentamente,');

        doc.moveDown(3);

        doc.font('Arial')
            .fontSize(12)
            .text(visitNota.visit?.fiscalYear?.subsecretario_name || 'N/A');

        doc.font('Arial')
            .fontSize(12)
            .text('Subsecretario de Aseguramiento y Desarrollo de Servicios de Salud');

        doc.moveDown(2);

        doc.font('Arial')
            .fontSize(7)
            .text(`Redactó y Transcribió: ${visitNota.visit?.weekgroupVisit?.lead?.name || 'N/A'} ${visitNota.visit?.weekgroupVisit?.lead?.surname || ''} ${visitNota.visit?.weekgroupVisit?.lead?.lastname || ''} - ${visitNota.visit?.weekgroupVisit?.lead?.status || ''}`);

        doc.font('Arial')
            .fontSize(7)
            .text(`Archívese en carpeta de prestador: ${visitNota.visit?.prestador?.fiscalYearInformation[0]?.codigo_habilitacion || 'N/A'} ${visitNota.visit?.prestador?.fiscalYearInformation[0]?.nombre_prestador || 'N/A'}`);
    }

    private convertHtmlToPlainText(html: string): string {
        if (!html) return '';
        
        // Basic HTML to plain text conversion
        // Remove HTML tags but preserve some formatting
        let text = html
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<p[^>]*>/gi, '')
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .trim();

        return text;
    }

    private formatDate(date: Date | string): string {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
} 