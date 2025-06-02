import { 
  Body, 
  Controller, 
  HttpCode, 
  HttpStatus, 
  Param, 
  Put, 
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
import { UpdateUserDto } from '../dto/update.user.dto';
import { ModuleName, Permissions, Metadata } from '@decorators/index';
import { PermissionEnum } from '@enums/permissions';
import { ModulesEnum } from '@enums/modules';
import { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';
import * as fs from 'fs';

// Application
import { UpdateUser } from '../../application/update/update.user';
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
export class PutUsersController {
  constructor(private readonly updateUserService: UpdateUser) {}

  @Put(':id')
  @Permissions(PermissionEnum.UPDATE)
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
    summary: 'Update User with Signature',
    description:
      'Updates an existing user in the system with the specified information and optional signature image',
  })
  @ApiBody({
    description: 'User data with optional signature file',
    type: UpdateUserDto,
  })
  @Metadata('AUDIT', 'Actualización de usuario')
  @UseInterceptors(AuditInterceptor)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() signatureFile?: Express.Multer.File,
  ): Promise<Users> {
    try {
      // If signature file was uploaded, add the file path to the DTO
      if (signatureFile) {
        updateUserDto.signature = `signatures/users/${signatureFile.filename}`;
      }

      return await this.updateUserService.update(id, updateUserDto);
    } catch (error) {
      // If there was an error and a file was uploaded, clean it up
      if (signatureFile && fs.existsSync(signatureFile.path)) {
        fs.unlinkSync(signatureFile.path);
      }
      throw error;
    }
  }
} 