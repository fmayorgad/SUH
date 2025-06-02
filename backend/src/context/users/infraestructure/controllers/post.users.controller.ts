import { 
  Body, 
  Controller, 
  HttpCode, 
  HttpStatus, 
  Post, 
  UseInterceptors, 
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create.user.dto';
import { ModuleName, Permissions, Metadata } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';
import * as fs from 'fs';

// Application
import { CreateUser } from '../../application/create/create.user';
import { Users } from '@models/user.model';

// Multer configuration for signature uploads
const signatureStorage = diskStorage({
  destination: (req, file, cb) => {
    // Use root-level signatures directory
    const uploadPath = join(process.cwd(), '..', 'signatures', 'users');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = extname(file.originalname);
    cb(null, `signature-${uniqueSuffix}${fileExtension}`);
  },
});

// File filter for image files only
const imageFileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Solo se permiten archivos de imagen (JPG, JPEG, PNG, GIF)'), false);
  }
};

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class PostUsersController {
  constructor(private readonly createUserService: CreateUser) {}

  @Post('create')
  @Permissions(PermissionEnum.CREATE)
  @ModuleName(ModulesEnum.USERS)
  @UseInterceptors(
    FileInterceptor('signature', {
      storage: signatureStorage,
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    })
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create User with Signature',
    description:
      'Creates a new user in the system with the specified information and optional signature image',
  })
  @ApiBody({
    description: 'User data with optional signature file',
    type: CreateUserDto,
  })
  @Metadata('AUDIT', 'Creación de usuario')
  @UseInterceptors(AuditInterceptor)
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() signatureFile?: Express.Multer.File,
  ): Promise<Users> {
    try {
      // If signature file was uploaded, add the file path to the DTO
      if (signatureFile) {
        createUserDto.signature = `signatures/users/${signatureFile.filename}`;
      }

      return await this.createUserService.create(createUserDto);
    } catch (error) {
      // If there was an error and a file was uploaded, clean it up
      if (signatureFile && fs.existsSync(signatureFile.path)) {
        fs.unlinkSync(signatureFile.path);
      }
      throw error;
    }
  }
} 