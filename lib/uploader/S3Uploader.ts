import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export interface S3UploaderConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;

  maxAttempts?: number; // 重试次数
}

interface UploadParams {
  file: File;
  key: string;
  contentType?: string;
  onProgress?: (progress: number) => void; // 上传进度回调
  onSuccess?: (url: string) => void;
  onError?: (err: Error) => void;
}

export class S3Uploader {
  private s3Client: S3Client;
  private bucketName: string;

  private config: S3UploaderConfig;

  constructor(config: S3UploaderConfig) {
    this.config = config;
    this.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      maxAttempts: config.maxAttempts ?? 1,
    });
    this.bucketName = config.bucketName;
  }

  /**
   * 上传文件，带进度通知和自定义重试机制
   * @param params 上传参数
   */
  async uploadFile(params: UploadParams): Promise<void> {
    const { file, key, contentType, onProgress, onSuccess, onError } = params;

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: contentType || file.type,
      },
      partSize: 5 * 1024 * 1024, // 每个分片大小为5MB
      queueSize: 4, // 并发上传的请求数量
      leavePartsOnError: false, // 出错时清理已上传的分片
    });

    // 监听上传进度
    upload.on('httpUploadProgress', (progress) => {
      if (onProgress && progress.total) {
        const percentage = ((progress.loaded ?? 0) / progress.total) * 100;
        onProgress(percentage);
      }
    });

    try {
      await upload.done();
      console.log(`文件上传成功：${key}`);
      onSuccess?.(this.getFileUrl(key));
    } catch (error) {
      console.error('上传失败', error);
      onError?.(error);
      // throw new Error(`文件上传失败：${error}`);
    }
  }

  /**
   * 获取文件的 URL
   * @param key 文件在 S3 中的 key
   * @returns 文件的访问 URL
   */
  private getFileUrl(key: string): string {
    // todo: 产生url
    return `https://${this.bucketName}.s3.${this.config.region}.amazonaws.com/${key}`;
  }
}
