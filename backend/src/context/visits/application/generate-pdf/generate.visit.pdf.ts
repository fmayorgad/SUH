import { Inject, Injectable, Logger } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { VisitRepository } from '../../domain/visit.repository';

@Injectable()
export class GenerateVisitPdf {
    private readonly logger = new Logger(GenerateVisitPdf.name);
    private currentVisit: any;
    private headerPath: string;
    private footerPath: string;

    constructor(
        @Inject('PgsqlVisitRepository')
        private readonly visitRepository: VisitRepository,
    ) { 
        // Initialize paths on constructor
        this.headerPath = path.resolve(process.cwd(), 'templates/headers/gobernacionlogo.png');
        this.footerPath = path.resolve(process.cwd(), 'templates/footers/footer.png');
    }

    async execute(id: string): Promise<Buffer | null> {
        try {
            // Fetch the visit data from the repository
            const visit = await this.visitRepository.findById(id);

            if (!visit) {
                this.logger.error(`Visit with ID ${id} not found`);
                return null;
            }

            // Generate PDF using PDFKit
            const pdfBuffer = await this.generatePdf(visit);

            return pdfBuffer;
        } catch (error) {
            this.logger.error(`Error generating PDF for visit ${id}:`, error);
            throw error;
        }
    }

    private async generatePdf(visit: any): Promise<Buffer> {
        // Store current visit for use in header
        this.currentVisit = visit;

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
                Title: `Visita ${visit.id}`,
                Author: 'Secretaría de Salud del Valle del Cauca',
                Subject: 'Informe de Visita de Verificación',
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

        // Start with date information (which was previously in addDocumentInfo)
        doc.font('Arial')
            .text(`Santiago de Cali, ${this.formatDate(visit.date)}`, 50, 180);

        // Add document content
        this.addRecipientInfo(doc, visit);
        this.addSubject(doc);
        this.addMainContent(doc, visit);
        this.addAnnexReference(doc);
        this.addAdditionalInfo(doc);

        // Add technical areas and signature
        this.addVisitData(doc, visit);

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
            doc.text(`1.220.20-38.108 – ${this.currentVisit?.sade || 'N/A'}`);

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
    }

    private addSubject(doc: PDFKit.PDFDocument) {
        const startY = doc.y + 20;

        doc.font('Arial-Bold')
            .fontSize(12)
            .text('Asunto: COMUNICACIÓN DE VISITA DE VERIFICACIÓN DE CONDICIONES DE HABILITACIÓN – CERTIFICACIÓN DERIVADA DEL PLAN ANUAL DE VISITAS', 50, startY, {
                width: 500,
                align: 'left'
            });
    }

    private addMainContent(doc: PDFKit.PDFDocument, visit: any) {
        const startY = doc.y + 20;

        doc.font('Arial')
            .fontSize(12)
            .text('Cordial saludo:', 50, startY);

        doc.moveDown();

        doc.text(`Amablemente le comunicamos que la Comisión Técnica del Grupo Inspección, Vigilancia y Control de la Secretaría Departamental de Salud del Valle del Cauca se presentará en la sede de prestación de servicios con código ${visit.prestador?.identificador || 'N/A'} el día ${this.formatDate(visit.date)}, con el fin de realizar visita de CERTIFICACIÓN DERIVADA DEL PLAN ANUAL DE VISITAS, que tendrá una duración aproximada de 4 horas, lo cual dependerá de factores como la cantidad de servicios a verificar, el acceso a la información y la dinámica de la visita.`, {
            width: 500,
            align: 'justify'
        });

        doc.moveDown();

        doc.text('Para el desarrollo de esta actividad se recomienda revisar el anexo del presente documento, el cual consiste en una guía documental, para efectos de organización durante la visita; la cual no es exhaustiva, ni están contemplados en ella la totalidad de los requisitos normativos de la Resolución 3100 de 2019, que aplican para sus servicios.', {
            width: 500,
            align: 'justify'
        });
    }

    private addAnnexReference(doc: PDFKit.PDFDocument) {
        const startY = doc.y + 20;

        doc.font('Arial-Bold')
            .fontSize(12)
            .text('Ver ANEXO. LISTADO GUÍA DOCUMENTAL DE HABILITACIÓN', 50, startY);
    }

    private addAdditionalInfo(doc: PDFKit.PDFDocument) {
        const startY = doc.y + 20;

        doc.font('Arial')
            .fontSize(12)
            .text('Lo anterior, con el fin de que disponga del equipo humano y las medidas de bioseguridad, así como de la información que deba ser aportada, en medio físico y/o magnético, organizada por estándar y de acuerdo con lo requerido en la normatividad vigente; teniendo en cuenta que esta información será verificada por todos los integrantes de la comisión de manera simultánea.', 50, startY, {
                width: 500,
                align: 'justify'
            });

        doc.moveDown();

        doc.text('Adicionalmente, le informamos que durante la visita la comisión podrá realizar registro fotográfico y/o fílmico de las instalaciones físicas, los documentos, registros asistenciales y de la dotación, entre otros.', {
            width: 500,
            align: 'justify'
        });

        doc.moveDown();

        doc.text('Se dará inicio de la visita con presencia del representante legal del prestador o el personal que éste delegue por escrito, quien(es) firmará(n) el acta de visita por medio digital, la cual se enviará al correo electrónico como constancia de la diligencia y en ésta no se reportarán los hallazgos ni el resultado de la visita. Esta información será descrita en el informe que se enviará posteriormente al correo electrónico registrado en el REPS.', {
            width: 500,
            align: 'justify'
        });

        doc.moveDown();

        doc.text('De la Visita de Verificación que se ejecute se pueden generar las siguientes conductas posibles:', {
            width: 500,
            align: 'justify'
        });

        doc.moveDown();

        // Add the bullet points for possible outcomes
        doc.list([" Favorable", " No favorable"], {
            // this is how automatic line wrapping will work if the width is specified
            width: 100,
            align: 'left',
            listType: 'bullet',
            bulletRadius: 2,
        });

        doc.moveDown();

    }

    private addVisitData(doc: PDFKit.PDFDocument, visit: any) {
        const startY = doc.y + 30;

        doc.font('Arial')
            .fontSize(12)
            .text('A continuación, se relacionan los nombres de los Verificadores de Condiciones de Habilitación que integran la comisión técnica de la visita: ',
                {
                    width: 500,
                    align: 'justify'
                }
            );

        doc.moveDown(2);

        if (visit.visitVerificadores && visit.visitVerificadores.length > 0) {
            // Prepare the rows for the verificadores table
            const verificadoresRows = visit.visitVerificadores.filter(verificador => verificador.id !== visit.weekgroupVisit?.lead?.id).map(verificador => {
                const user = verificador.user_id || {};
                const fullName = `${user.name || 'N/A'} ${user.surname || ''} ${user.lastname || ''}`.trim();
                const cedula = user.identification_number || 'N/A';
                return [fullName, cedula];
            });


            // Table for the lead
            this.drawTable(
                doc,
                [
                    ['NOMBRE', 'No. CÉDULA'],
                    [`${visit.weekgroupVisit?.lead?.name || 'N/A'} ${visit.weekgroupVisit?.lead?.surname || ''} ${visit.weekgroupVisit?.lead?.lastname || ''}`, `${visit.weekgroupVisit?.lead?.identification_number || 'N/A'}`],
                    ...verificadoresRows
                ],
                {
                    x: 50,
                    y: doc.y,
                    columnWidths: [200, 300],
                    showBorders: false,
                    showBackground: false
                }
            );


        }

        doc.moveDown(2);

        doc.font('Arial')
        .fontSize(12)
        .text('Adicional a la comisión técnica mencionada anteriormente, en caso de ser necesario esta podrá ser modificada por uno o varios de los verificadores relacionados en: "ANEXO. LISTADO DE VERIFICADORES" (ver documento adjunto)',
            {
                width: 500,
                align: 'justify'
            }
        );

        doc.moveDown(1);

        doc.font('Arial')
        .fontSize(12)
        .text('Agradecemos de antemano su disposición para que la visita se desarrolle de manera adecuada y oportuna.',
            {
                width: 500,
                align: 'justify'
            }
        );

        doc.moveDown(1);

        doc.font('Arial')
        .fontSize(12)
        .text('NOTA: "Comunicada la visita de verificación, el prestador de servicios de salud no podrá presentar novedades mientras esta no haya concluido", Resolución 3100 de 2019, Artículo 17.',
            {
                width: 500,
                align: 'justify'
            }
        );

        doc.moveDown(2);

        doc.font('Arial')
        .fontSize(12)
        .text('Atentamente,',
            {
                width: 500,
                align: 'justify'
            }
        );

        doc.moveDown(3);

        doc.font('Arial')
        .fontSize(12)
        .text(visit?.fiscalYear?.subsecretario_name || 'N/A');
        

        doc.font('Arial')
        .fontSize(12)
        .text('Subsecretario de Aseguramiento y Desarrollo de Servicios de Salud');

        doc.moveDown(2);

        doc.font('Arial')
        .fontSize(7)
        .text(`Redactó y Transcribió: ${visit.weekgroupVisit?.lead?.name || 'N/A'} ${visit.weekgroupVisit?.lead?.surname || ''} ${visit.weekgroupVisit?.lead?.lastname || ''} - ${visit.weekgroupVisit?.lead?.status}`);

        doc.font('Arial')
        .fontSize(7)
        .text(`Archívese en carpeta de prestador: ${visit.prestador?.fiscalYearInformation[0].codigo_habilitacion || 'N/A'} ${visit.prestador?.fiscalYearInformation[0].nombre_prestador || 'N/A'} `);

      
    }



    private drawTable(
        doc: PDFKit.PDFDocument,
        data: string[][],
        options: {
            x: number,
            y: number,
            columnWidths: number[],
            showBorders?: boolean,
            showBackground?: boolean
        }
    ) {
        const { x, y, columnWidths } = options;
        const showBorders = options.showBorders !== undefined ? options.showBorders : true;
        const showBackground = options.showBackground !== undefined ? options.showBackground : true;
        const rowHeight = 20;
        const cellPadding = 0;
        const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);

        // Draw table rows
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const isHeader = i === 0;

            // Draw cell backgrounds
            if (isHeader && showBackground) {
                doc.fillColor('#f2f2f2').rect(x, y + (i * rowHeight), totalWidth, rowHeight).fill();
            }

            // Set border color
            doc.strokeColor(showBorders ? '#000000' : '#FFFFFF');

            for (let j = 0; j < row.length; j++) {
                const cellX = x + columnWidths.slice(0, j).reduce((sum, width) => sum + width, 0);
                const cellY = y + (i * rowHeight);

                // Draw cell rectangle
                doc.rect(cellX, cellY, columnWidths[j], rowHeight).stroke();

                // Draw cell text
                doc.fillColor('#000000');
                if (isHeader) {
                    doc.font('Arial-Bold');
                } else {
                    doc.font('Arial');
                }

                doc.fontSize(12)
                    .text(row[j],
                        cellX + cellPadding,
                        cellY + cellPadding,
                        {
                            width: columnWidths[j] - (2 * cellPadding),
                            height: rowHeight - (2 * cellPadding)
                        });
            }
        }

        // Update the document y position
        doc.y = y + (data.length * rowHeight) + 10;
        doc.x = x;

    }

    private formatVerificadores(verificadoresString: string): string {
        if (!verificadoresString) return 'N/A';

        try {
            // If it's a string representation of an array like '{uuid1,uuid2}'
            if (typeof verificadoresString === 'string' && verificadoresString.startsWith('{') && verificadoresString.endsWith('}')) {
                // Remove curly braces and split by commas
                const uuids = verificadoresString.slice(1, -1).split(',').map(id => id.replace(/"/g, '').trim());
                return uuids.join(', ');
            }
            return verificadoresString;
        } catch (error) {
            this.logger.error('Error formatting verificadores:', error);
            return verificadoresString;
        }
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

    private formatTime(time: string): string {
        if (!time) return 'N/A';
        return time;
    }
} 