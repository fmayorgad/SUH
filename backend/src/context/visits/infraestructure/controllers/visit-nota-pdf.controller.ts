import { Controller, Get, HttpStatus, Param, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { GenerateVisitNotaPdf } from '../../application/generate-nota-pdf/generate.visit-nota.pdf';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { ModuleName, Permissions } from '@decorators/index';

@ApiTags('Visits')
@ApiBearerAuth()
@Controller('visits')
export class VisitNotaPdfController {
  private readonly logger = new Logger(VisitNotaPdfController.name);

  constructor(private readonly generateVisitNotaPdf: GenerateVisitNotaPdf) {}
  
  @Get('notas/:id/pdf')
  @Permissions(PermissionEnum.READ)
  @ModuleName(ModulesEnum.VISITS)
  @ApiOperation({ summary: 'Generate a PDF for a visit nota aclaratoria' })
  @ApiParam({ name: 'id', description: 'Visit Nota ID', type: 'string' })
  @ApiResponse({ status: HttpStatus.OK, description: 'PDF generated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Visit nota not found' })
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    try {
      this.logger.log(`Received request to generate PDF for visit nota ID: ${id}`);
      
      const pdfBuffer = await this.generateVisitNotaPdf.execute(id);
      
      if (!pdfBuffer) {
        this.logger.error(`PDF buffer is null for visit nota ID: ${id}`);
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Visit nota not found or PDF could not be generated',
        });
      }

      this.logger.log(`PDF generated successfully for visit nota ID: ${id}, buffer size: ${pdfBuffer.length} bytes`);

      // Set appropriate headers for PDF response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="visit-nota-${id}.pdf"`);
      
      // Send the PDF buffer
      return res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      this.logger.error(`Error in generatePdf controller for visit nota ID: ${id}:`, error);
      this.logger.error(`Error stack: ${error.stack}`);
      
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        error: error.stack
      });
    }
  }
} 