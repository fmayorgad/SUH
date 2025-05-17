import { Controller, Post, Body, HttpCode, HttpStatus, UploadedFiles, UseInterceptors, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateVisit } from '../../application/create/create.visit';
import { CreateVisitDTO } from '../dto/create.visit.dto';
import { Visit } from '@models/visit.model';
import { ModulesEnum } from '@enums/modules';
import { PermissionEnum } from '@enums/permissions';
import { ModuleName, Permissions, Metadata } from '@decorators/index';
import { Request } from 'express';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';

// Define local interface since we're using Express.Multer
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Define interface for JWT payload
interface JwtPayload {
  sub: string;
  id: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

@ApiTags('Visits')
@ApiBearerAuth()
@Controller('visits')
export class PostVisitController {
  constructor(private readonly createVisitService: CreateVisit) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @Permissions(PermissionEnum.CREATE) // Add appropriate permissions
  @ModuleName(ModulesEnum.VISITS) // Use VISITS enum if available
  @Metadata('AUDIT', 'Creación de visita')
  @UseInterceptors(AuditInterceptor)
  @ApiOperation({ summary: 'Create a new visit' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'serviciosFile', maxCount: 1 },
    { name: 'capacidadFile', maxCount: 1 },
  ]))
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Visit created successfully',
    type: Visit,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async createVisit(
    @Body() createVisitDto: CreateVisitDTO,
    @UploadedFiles() files: { serviciosFile?: MulterFile[], capacidadFile?: MulterFile[] },
    @Req() request: Request & { user?: JwtPayload }
  ) {
    
    // Extract user ID from JWT token (NestJS attaches this to request.user via AuthGuard)
    const userId = request.user?.id;
    
    if (!userId) {
      console.warn('User ID not found in JWT token, proceeding without user ID');
    } else {
      console.log('User ID from JWT:', userId);
    }
    
    return await this.createVisitService.run(createVisitDto, files, userId);
  }
} 