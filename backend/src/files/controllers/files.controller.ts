import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { FileService } from '../services/file.service';
import {
  UploadFileDto,
  UpdateFileDto,
  FileResponseDto,
  DeleteFileResponseDto,
} from '../dtos';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload a file',
    description:
      'Upload a file to the storage system. File type (image, audio, document, video) is automatically detected from the file extension and MIME type. No need to specify the type manually.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'File uploaded successfully with auto-detected type',
    type: FileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid or unsupported file type',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error during file upload',
  })
  @FormDataRequest()
  async uploadFile(
    @Body() uploadFileDto: UploadFileDto,
  ): Promise<FileResponseDto> {
    return await this.fileService.saveFile(uploadFileDto.file);
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a file',
    description:
      'Replace an existing file with a new one using a safe update process. ' +
      'The system creates a backup of the old file, uploads the new one, verifies its creation, ' +
      'and only then deletes the old file. If anything fails, the original file is restored from backup. ' +
      'File type is automatically detected from the new file extension and MIME type.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File updated successfully with rollback protection',
    type: FileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file ID or unsupported file type',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'File with specified ID not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'Internal server error during file update (backup restored if possible)',
  })
  @FormDataRequest()
  async updateFile(
    @Body() updateFileDto: UpdateFileDto,
  ): Promise<FileResponseDto> {
    return await this.fileService.updateFile(
      updateFileDto.fileId,
      updateFileDto.file,
    );
  }

  @Delete(':fileId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a file',
    description:
      'Delete a file from the storage system using its unique ID. Both the file and its database record will be removed.',
  })
  @ApiParam({
    name: 'fileId',
    description: 'Unique ID of the file to delete',
    example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File deleted successfully',
    type: DeleteFileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'File with specified ID not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error during file deletion',
  })
  async deleteFile(
    @Param('fileId', ParseUUIDPipe) fileId: string,
  ): Promise<DeleteFileResponseDto> {
    await this.fileService.deleteFile(fileId);
    return {
      message: 'File deleted successfully',
    };
  }
}
