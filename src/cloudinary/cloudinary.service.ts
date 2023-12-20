import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2,
  UploadApiOptions,
} from 'cloudinary';
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

  async uploadImageTmp(
    file: Express.Multer.File,
    uploadOptions: UploadApiOptions = {},
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        ...uploadOptions,
        eager_async: true,
        eager_notification_url: 'http://example.com/notify_endpoint', // URL endpoint để nhận thông báo khi biến đổi ảnh hoàn tất (tùy chọn)
      };

      const upload = v2.uploader.upload_stream(options, (error, result) => {
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

  async uploadImageToCloudinaryTmp(file: Express.Multer.File) {
    try {
      const uploadOptions = {
        folder: 'tmp',
        invalidate: true,
        invalidate_after: 2 * 60 * 60,
      };

      const imageUrl = await this.uploadImageTmp(file, uploadOptions).catch(
        () => {
          throw new BadRequestException('Invalid file type.');
        },
      );
      return {
        url: imageUrl.url,
        message: 'Upload success. Delete after 2 hours.',
      };
    } catch (error) {
      console.log(error);
      return {
        url: 'http://res.cloudinary.com/dm6vzyxzh/image/upload/v1686325007/ymias8htkuuboccykul1.png',
        message: 'Upload failed.',
      };
    }
  }

  async deleteImage(param): Promise<any> {
    const { publicId } = param;
    console.log(decodeURIComponent(publicId));

    try {
      const result = await v2.uploader.destroy(decodeURIComponent(publicId));
      return {
        result,
        message: 'Delete image.',
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Delete failed.',
      };
    }
  }
}
