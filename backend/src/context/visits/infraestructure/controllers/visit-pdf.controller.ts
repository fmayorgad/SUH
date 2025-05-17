import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GenerateVisitPdf } from '../../application/generate-pdf/generate.visit.pdf';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { ModuleName, Permissions } from '@decorators/index';

@ApiTags('Visits')
@ApiBearerAuth()
@Controller('visits')
export class VisitPdfController {
  constructor(private readonly generateVisitPdf: GenerateVisitPdf) {}
  
  @Get(':id/pdf')
  @Permissions(PermissionEnum.READ)
  @ModuleName(ModulesEnum.VISITS)
  @ApiOperation({ summary: 'Generate a PDF for a visit' })
  @ApiParam({ name: 'id', description: 'Visit ID', type: 'string' })
  @ApiResponse({ status: HttpStatus.OK, description: 'PDF generated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Visit not found' })
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.generateVisitPdf.execute(id);
      
      if (!pdfBuffer) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Visit not found or PDF could not be generated',
        });
      }

      // Set appropriate headers for PDF response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="visit-${id}.pdf"`);
      
      // Send the PDF buffer
      return res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
} 