import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload-cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadImageToCloudinary(file);
  }

  @Post('/image-tmp')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileTmp(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadImageToCloudinaryTmp(file);
  }

  @Delete('/image/:publicId')
  async deleteFile(@Param() param) {
    console.log(param);
    return this.cloudinaryService.deleteImage(param);
  }
}
