import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GenerateVisitNotaPdf } from '../../application/generate-nota-pdf/generate.visit-nota.pdf';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { ModuleName, Permissions } from '@decorators/index';

@ApiTags('Visit Notas')
@ApiBearerAuth()
@Controller('visit-notas')
export class VisitNotaPdfController {
  constructor(private readonly generateVisitNotaPdf: GenerateVisitNotaPdf) {}
  
  @Get(':id/pdf')
  @Permissions(PermissionEnum.READ)
  @ModuleName(ModulesEnum.VISITS)
  @ApiOperation({ summary: 'Generate a PDF for a visit nota aclaratoria' })
  @ApiParam({ name: 'id', description: 'Visit Nota ID', type: 'string' })
  @ApiResponse({ status: HttpStatus.OK, description: 'PDF generated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Visit nota not found' })
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.generateVisitNotaPdf.execute(id);
      
      if (!pdfBuffer) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Visit nota not found or PDF could not be generated',
        });
      }

      // Set appropriate headers for PDF response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="visit-nota-${id}.pdf"`);
      
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