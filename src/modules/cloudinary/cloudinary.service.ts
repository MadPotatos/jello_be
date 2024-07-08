import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadImageToCloudinary(file: Express.Multer.File) {
    try {
      const imageUrl = await this.uploadImage(file).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
      return { url: imageUrl.url, message: 'Upload success.' };
    } catch (error) {
      console.log(error);
      return { url: '', message: 'Upload failed.' };
    }
  }
}
