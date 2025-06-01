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
            this.logger.log(`Starting PDF generation for visit nota ID: ${id}`);
            
            // Fetch the visit nota data from the repository
            const visitNota = await this.visitNotaRepository.findById(id);

            if (!visitNota) {
                this.logger.error(`Visit nota with ID ${id} not found`);
                return null;
            }

            this.logger.log(`Visit nota found with basic info: ID=${visitNota.id}, type=${visitNota.type}, acta_number=${visitNota.acta_number}`);
            
            // Log the visit structure
            if (visitNota.visit) {
                this.logger.log(`Visit data structure: ID=${visitNota.visit.id}, sade=${visitNota.visit.sade}`);
                
                if (visitNota.visit.prestador) {
                    this.logger.log(`Prestador data: ID=${visitNota.visit.prestador.id}, nombreSede=${visitNota.visit.prestador.nombreSede}`);
                    
                    if (visitNota.visit.prestador.fiscalYearInformation) {
                        this.logger.log(`FiscalYearInformation array length: ${visitNota.visit.prestador.fiscalYearInformation.length}`);
                        if (visitNota.visit.prestador.fiscalYearInformation.length > 0) {
                            const fiscalInfo = visitNota.visit.prestador.fiscalYearInformation[0];
                            this.logger.log(`FiscalYearInformation[0]: representante_legal=${fiscalInfo.representante_legal}, nombre_prestador=${fiscalInfo.nombre_prestador}`);
                        }
                    } else {
                        this.logger.error(`FiscalYearInformation is null or undefined`);
                    }
                } else {
                    this.logger.error(`Visit prestador is null or undefined`);
                }
            } else {
                this.logger.error(`Visit is null or undefined`);
            }

            // Generate PDF using PDFKit
            const pdfBuffer = await this.generatePdf(visitNota);

            this.logger.log(`PDF generation completed successfully for visit nota ID: ${id}`);
            return pdfBuffer;
        } catch (error) {
            this.logger.error(`Error generating PDF for visit nota ${id}:`, error);
            this.logger.error(`Error stack: ${error.stack}`);
            throw error;
        }
    }

    private async generatePdf(visitNota: any): Promise<Buffer> {
        try {
            this.logger.log(`Starting generatePdf method`);
            
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

            // Add document content with error handling
            try {
                this.logger.log(`Adding recipient info...`);
                this.addRecipientInfo(doc, visitNota.visit);
            } catch (error) {
                this.logger.error(`Error in addRecipientInfo:`, error);
                throw error;
            }

            try {
                this.logger.log(`Adding subject...`);
                this.addSubject(doc, visitNota);
            } catch (error) {
                this.logger.error(`Error in addSubject:`, error);
                throw error;
            }

            try {
                this.logger.log(`Adding main content...`);
                this.addMainContent(doc, visitNota);
            } catch (error) {
                this.logger.error(`Error in addMainContent:`, error);
                throw error;
            }

            try {
                this.logger.log(`Adding signature...`);
                this.addSignature(doc, visitNota);
            } catch (error) {
                this.logger.error(`Error in addSignature:`, error);
                throw error;
            }

            // Finalize the PDF
            doc.end();

            // Return a promise that resolves with the PDF buffer
            return new Promise((resolve, reject) => {
                doc.on('end', () => {
                    try {
                        const pdfData = Buffer.concat(buffers);
                        this.logger.log(`PDF buffer created successfully, size: ${pdfData.length} bytes`);
                        resolve(pdfData);
                    } catch (error) {
                        this.logger.error(`Error creating PDF buffer:`, error);
                        reject(error);
                    }
                });
                
                doc.on('error', (error) => {
                    this.logger.error(`PDF document error:`, error);
                    reject(error);
                });
            });
        } catch (error) {
            this.logger.error(`Error in generatePdf method:`, error);
            this.logger.error(`Error stack: ${error.stack}`);
            throw error;
        }
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
        try {
            this.logger.log(`Starting addRecipientInfo method`);
            
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

            this.logger.log(`addRecipientInfo completed successfully`);
        } catch (error) {
            this.logger.error(`Error in addRecipientInfo method:`, error);
            this.logger.error(`Error stack: ${error.stack}`);
            throw error;
        }
    }

    private addSubject(doc: PDFKit.PDFDocument, visitNota: any) {
        try {
            this.logger.log(`Starting addSubject method`);
            
            const startY = doc.y + 20;

            const type = visitNota?.type?.toUpperCase() || 'N/A';
            const actaNumber = visitNota?.acta_number || 'N/A';

            doc.font('Arial-Bold')
                .fontSize(12)
                .text(`Asunto: NOTA ACLARATORIA - ${type} No. ${actaNumber}`, 50, startY, {
                    width: 500,
                    align: 'left'
                });

            this.logger.log(`addSubject completed successfully`);
        } catch (error) {
            this.logger.error(`Error in addSubject method:`, error);
            this.logger.error(`Error stack: ${error.stack}`);
            throw error;
        }
    }

    private addMainContent(doc: PDFKit.PDFDocument, visitNota: any) {
        try {
            this.logger.log(`Starting addMainContent method`);
            
            const startY = doc.y + 20;

            doc.font('Arial')
                .fontSize(12)
                .text('Cordial saludo:', 50, startY);

            doc.moveDown();

            // Add justification
            doc.font('Arial-Bold')
                .text('Justificación:');
            
            const justification = visitNota?.justification || 'N/A';
            doc.font('Arial')
                .text(justification, {
                    width: 500,
                    align: 'justify'
                });

            doc.moveDown(2);

            // Add the main content (rich text body)
            doc.font('Arial-Bold')
                .text('Contenido:');

            doc.moveDown();

            // Render HTML content with formatting support
            const htmlContent = visitNota?.body || '';
            if (htmlContent.trim()) {
                this.renderHtmlContent(doc, htmlContent, {
                    width: 500,
                    align: 'justify'
                });
            } else {
                doc.font('Arial')
                    .text('N/A', {
                        width: 500,
                        align: 'justify'
                    });
            }

            this.logger.log(`addMainContent completed successfully`);
        } catch (error) {
            this.logger.error(`Error in addMainContent method:`, error);
            this.logger.error(`Error stack: ${error.stack}`);
            throw error;
        }
    }

    private addSignature(doc: PDFKit.PDFDocument, visitNota: any) {
        try {
            this.logger.log(`Starting addSignature method`);
            
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

            this.logger.log(`addSignature completed successfully`);
        } catch (error) {
            this.logger.error(`Error in addSignature method:`, error);
            this.logger.error(`Error stack: ${error.stack}`);
            throw error;
        }
    }

    /**
     * Render HTML content to PDF with basic styling support for Quill editor
     * Supports only: bold text (<strong>, <b>), ordered lists (<ol><li>), unordered lists (<ul><li>)
     * This matches the limited toolbar configuration in the frontend Quill editor
     */
    private renderHtmlContent(doc: PDFKit.PDFDocument, html: string, options: any = {}) {
        if (!html) return;

        const defaultOptions = {
            width: 500,
            align: 'justify',
            ...options
        };

        // Parse and render HTML content properly
        this.parseAndRenderQuillHtml(doc, html, defaultOptions);
    }

    /**
     * Parse and render HTML from Quill editor with support for bold and lists only
     */
    private parseAndRenderQuillHtml(doc: PDFKit.PDFDocument, html: string, options: any) {
        // Clean up HTML entities
        let cleanHtml = html
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"');

        // Process the HTML content block by block
        this.processHtmlBlocks(doc, cleanHtml, options);
    }

    /**
     * Process HTML content block by block (paragraphs, lists)
     */
    private processHtmlBlocks(doc: PDFKit.PDFDocument, html: string, options: any) {
        // Parse the HTML into structured blocks
        const blocks = this.parseHtmlContent(html);
        
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            
            if (block.type === 'paragraph' && block.content.trim()) {
                this.renderParagraphWithFormatting(doc, block.content, options);
                // Add generous spacing after paragraph (except for the last block)
                if (i < blocks.length - 1) {
                    doc.moveDown(1.5); // Increased from 1.0 to 1.5 for more breathing room
                }
            } else if (block.type === 'ordered-list') {
                this.renderOrderedList(doc, block.items, options);
                // Reset position to left margin after list
                doc.x = 50;
                // Add generous spacing after list
                if (i < blocks.length - 1) {
                    doc.moveDown(1.5); // Increased from 1.0 to 1.5 for more breathing room
                }
            } else if (block.type === 'unordered-list') {
                this.renderUnorderedList(doc, block.items, options);
                // Reset position to left margin after list
                doc.x = 50;
                // Add generous spacing after list
                if (i < blocks.length - 1) {
                    doc.moveDown(1.5); // Increased from 1.0 to 1.5 for more breathing room
                }
            }
        }
    }

    /**
     * Parse HTML content into structured blocks
     */
    private parseHtmlContent(html: string): Array<any> {
        const blocks: Array<any> = [];
        
        // Split by major block elements but keep the tags for processing
        const parts = html.split(/(<\/?(?:p|ol|ul|li)[^>]*>)/gi);
        
        let currentBlock = null;
        let currentList = null;
        let currentListItem = '';
        let inListItem = false;
        
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i].trim();
            if (!part) continue;
            
            if (part.match(/^<p[^>]*>/i)) {
                // Start paragraph
                if (currentList) {
                    // We're in a list, finish it first
                    this.finishCurrentList(blocks, currentList, currentListItem);
                    currentList = null;
                    currentListItem = '';
                }
                currentBlock = { type: 'paragraph', content: '' };
            } else if (part.match(/^<\/p>/i)) {
                // End paragraph
                if (currentBlock && currentBlock.content.trim()) {
                    blocks.push(currentBlock);
                }
                currentBlock = null;
            } else if (part.match(/^<ol[^>]*>/i)) {
                // Start ordered list
                if (currentBlock) {
                    blocks.push(currentBlock);
                    currentBlock = null;
                }
                currentList = { type: 'ordered-list', items: [] };
            } else if (part.match(/^<ul[^>]*>/i)) {
                // Start unordered list
                if (currentBlock) {
                    blocks.push(currentBlock);
                    currentBlock = null;
                }
                currentList = { type: 'unordered-list', items: [] };
            } else if (part.match(/^<\/(?:ol|ul)>/i)) {
                // End list
                if (currentList) {
                    if (currentListItem.trim()) {
                        currentList.items.push(currentListItem.trim());
                    }
                    blocks.push(currentList);
                    currentList = null;
                    currentListItem = '';
                    inListItem = false;
                }
            } else if (part.match(/^<li[^>]*>/i)) {
                // Start list item
                if (currentListItem.trim()) {
                    currentList.items.push(currentListItem.trim());
                }
                currentListItem = '';
                inListItem = true;
            } else if (part.match(/^<\/li>/i)) {
                // End list item
                if (currentListItem.trim() && currentList) {
                    currentList.items.push(currentListItem.trim());
                }
                currentListItem = '';
                inListItem = false;
            } else if (!part.match(/^<[^>]+>$/)) {
                // This is actual content
                if (currentList && inListItem) {
                    // We're in a list item
                    currentListItem += (currentListItem ? ' ' : '') + part;
                } else if (currentList) {
                    // We're in a list but not in a specific item
                    currentListItem += (currentListItem ? ' ' : '') + part;
                } else if (currentBlock) {
                    // We're in a paragraph
                    currentBlock.content += (currentBlock.content ? ' ' : '') + part;
                } else {
                    // Create a new paragraph block
                    currentBlock = { type: 'paragraph', content: part };
                }
            }
        }
        
        // Handle any remaining content
        if (currentBlock && currentBlock.content.trim()) {
            blocks.push(currentBlock);
        }
        
        if (currentList) {
            if (currentListItem.trim()) {
                currentList.items.push(currentListItem.trim());
            }
            blocks.push(currentList);
        }
        
        return blocks;
    }

    /**
     * Helper method to finish current list processing
     */
    private finishCurrentList(blocks: Array<any>, currentList: any, currentListItem: string) {
        if (currentListItem.trim()) {
            currentList.items.push(currentListItem.trim());
        }
        if (currentList.items.length > 0) {
            blocks.push(currentList);
        }
    }

    /**
     * Render a paragraph with bold formatting and line break support
     */
    private renderParagraphWithFormatting(doc: PDFKit.PDFDocument, content: string, options: any) {
        // First handle line breaks
        const lines = content.split(/<br\s*\/?>/gi);
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                this.renderLineWithBoldSupport(doc, line, options);
            }
            
            // Add generous line break spacing between lines (except for the last one)
            if (i < lines.length - 1) {
                doc.moveDown(1.2); // Increased from 0.8 to 1.2 for even more space
            }
        }
    }

    /**
     * Render a single line with bold formatting support
     */
    private renderLineWithBoldSupport(doc: PDFKit.PDFDocument, content: string, options: any) {
        // Split by bold tags to handle mixed formatting
        const parts = content.split(/(<\/?(?:strong|b)[^>]*>)/gi);
        
        let isBold = false;
        let hasContent = false;
        
        for (const part of parts) {
            if (part.match(/^<(?:strong|b)[^>]*>/i)) {
                isBold = true;
                continue;
            } else if (part.match(/^<\/(?:strong|b)>/i)) {
                isBold = false;
                continue;
            }
            
            const cleanText = this.cleanHtmlContent(part);
            if (cleanText.trim()) {
                doc.font(isBold ? 'Arial-Bold' : 'Arial')
                   .fontSize(12)
                   .fillColor('#000000');
                
                doc.text(cleanText, {
                    ...options,
                    continued: true
                });
                hasContent = true;
            }
        }
        
        // End the continued text properly only if we had content
        if (hasContent) {
            doc.text('', { continued: false });
        }
    }

    /**
     * Render ordered list with proper indentation and spacing like a normal document
     */
    private renderOrderedList(doc: PDFKit.PDFDocument, items: string[], options: any) {
        // Add some spacing before the list starts
        doc.moveDown(0.3);
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            if (item.trim()) {
                // Set indented position for list (standard document indentation)
                const listIndent = 70; // Indent list from left margin (20px indent)
                doc.x = listIndent;
                const startY = doc.y;
                
                // Render number
                doc.font('Arial').fontSize(12).fillColor('#000000');
                doc.text(`${i + 1}. `, listIndent, startY);
                
                // Calculate the width of the number and space
                const numberText = `${i + 1}. `;
                const numberWidth = doc.widthOfString(numberText);
                
                // Set position for content (right after the number)
                const contentX = listIndent + numberWidth;
                
                // Render content with bold support
                this.renderListItemContent(doc, item, {
                    ...options,
                    width: options.width - (contentX - 50) - 10, // Adjust width for indentation
                    startX: contentX,
                    startY: startY
                });
                
                // Add generous space between list items for better readability
                if (i < items.length - 1) {
                    doc.moveDown(0.8); // Increased from 0.6 to 0.8
                }
            }
        }
    }

    /**
     * Render unordered list with proper indentation and spacing like a normal document
     */
    private renderUnorderedList(doc: PDFKit.PDFDocument, items: string[], options: any) {
        // Add some spacing before the list starts
        doc.moveDown(0.3);
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            if (item.trim()) {
                // Set indented position for list (standard document indentation)
                const listIndent = 70; // Indent list from left margin (20px indent)
                doc.x = listIndent;
                const startY = doc.y;
                
                // Render bullet
                doc.font('Arial').fontSize(12).fillColor('#000000');
                doc.text('• ', listIndent, startY);
                
                // Calculate the width of the bullet and space
                const bulletText = '• ';
                const bulletWidth = doc.widthOfString(bulletText);
                
                // Set position for content (right after the bullet)
                const contentX = listIndent + bulletWidth;
                
                // Render content with bold support
                this.renderListItemContent(doc, item, {
                    ...options,
                    width: options.width - (contentX - 50) - 10, // Adjust width for indentation
                    startX: contentX,
                    startY: startY
                });
                
                // Add generous space between list items for better readability
                if (i < items.length - 1) {
                    doc.moveDown(0.8); // Increased from 0.6 to 0.8
                }
            }
        }
    }

    /**
     * Render list item content with bold support and proper positioning
     */
    private renderListItemContent(doc: PDFKit.PDFDocument, content: string, options: any) {
        // Handle line breaks in list items
        const lines = content.split(/<br\s*\/?>/gi);
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                // Set position for this line
                const currentY = i === 0 ? options.startY : doc.y;
                const currentX = options.startX;
                
                // Handle bold formatting within the line
                const parts = line.split(/(<\/?(?:strong|b)[^>]*>)/gi);
                
                let isBold = false;
                let lineHasContent = false;
                let currentLineX = currentX;
                
                // Set initial position
                doc.x = currentX;
                doc.y = currentY;
                
                for (const part of parts) {
                    if (part.match(/^<(?:strong|b)[^>]*>/i)) {
                        isBold = true;
                        continue;
                    } else if (part.match(/^<\/(?:strong|b)>/i)) {
                        isBold = false;
                        continue;
                    }
                    
                    const cleanText = this.cleanHtmlContent(part);
                    if (cleanText.trim()) {
                        doc.font(isBold ? 'Arial-Bold' : 'Arial')
                           .fontSize(12)
                           .fillColor('#000000');
                        
                        // Render text at current position
                        doc.text(cleanText, currentLineX, currentY, {
                            width: options.width,
                            continued: true,
                            lineBreak: false
                        });
                        
                        // Update position for next part
                        currentLineX += doc.widthOfString(cleanText);
                        lineHasContent = true;
                    }
                }
                
                // End the continued text if we had content
                if (lineHasContent) {
                    doc.text('', { continued: false });
                }
            }
            
            // Add generous line break spacing between lines in list item (except for the last one)
            if (i < lines.length - 1) {
                doc.moveDown(1.2); // Increased from 0.8 to 1.2 for more space
            }
        }
        
        // Ensure we're positioned correctly for the next list item
        doc.moveDown(0.3); // Increased from 0.2
    }

    /**
     * Clean HTML content by removing tags and entities
     */
    private cleanHtmlContent(content: string): string {
        if (!content) return '';
        
        return content
            // Remove all HTML tags
            .replace(/<[^>]*>/g, '')
            // Clean up extra whitespace
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * Convert HTML to plain text (fallback method)
     */
    private convertHtmlToPlainText(html: string): string {
        if (!html) return '';
        
        // Basic HTML to plain text conversion
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