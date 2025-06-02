import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@ApiTags('Users')
@Controller('users')
export class SignatureUsersController {
    @Get('signature/:filename')
    @ApiOperation({
        summary: 'Get User Signature Image',
        description: 'Serves user signature image files',
    })
    async getSignatureFile(@Param('filename') filename: string, @Res() res: Response) {
        try {
            // Use root-level signatures directory
            const filePath = path.join(process.cwd(), '..', 'signatures', 'users', filename);
            
            // Check if file exists
            if (!fs.existsSync(filePath)) {
                throw new NotFoundException('Signature file not found');
            }

            // Get file stats
            const stats = fs.statSync(filePath);
            
            // Set appropriate headers
            res.setHeader('Content-Type', this.getContentType(filename));
            res.setHeader('Content-Length', stats.size);
            res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
            
            // Create read stream and pipe to response
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new NotFoundException('Error serving signature file');
        }
    }

    private getContentType(filename: string): string {
        const ext = path.extname(filename).toLowerCase();
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                return 'image/jpeg';
            case '.png':
                return 'image/png';
            case '.gif':
                return 'image/gif';
            default:
                return 'application/octet-stream';
        }
    }
} 