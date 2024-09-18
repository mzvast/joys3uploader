import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export type IConfig = {
  bucketName: string;
} & S3ClientConfig;

interface UploadParams {
  file: File;
  key: string;
  contentType?: string;
  onProgress?: (progress: number) => void; // 上传进度回调
  onSuccess?: (url: string) => void;
  // onError?: (err: Error) => void;

  partSize?: number; // 分片大小
}

export class S3Uploader {
  private s3Client: S3Client;
  private config: IConfig;
  private bucketName: string;

  constructor(config: IConfig) {
    // this.config = config;
    // this.s3Client = new S3Client(config);
    // this.bucketName = config.bucketName;
    this.init(config);
  }

  init(config: IConfig) {
    this.unInit();
    this.config = config;
    this.s3Client = new S3Client(config);
    this.bucketName = config.bucketName;
  }

  unInit() {
    if (this.s3Client) this.s3Client.destroy();
  }

  /**
   * 上传文件，带进度通知和自定义重试机制
   * @param params 上传参数
   */
  async uploadFile(params: UploadParams): Promise<string> {
    const { file, key, contentType, onProgress /*onSuccess, onError*/, partSize } = params;

    console.log('🚀 ~ S3Uploader ~ uploadFile ~ file:', file);

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: contentType || file.type,
      },
      partSize: partSize ?? 5 * 1024 * 1024, // 每个分片大小为5MB
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
      const res = await upload.done();
      console.log(`文件上传成功：${key}`);
      console.log('🚀 ~ S3Uploader ~ uploadFile ~ res.Location:', res.Location);

      return res.Location;
    } catch (error) {
      // console.error('上传失败', error);
      // onError?.(error);
      throw error;
    }
  }

  /**
   * 获取文件的 URL
   * @param key 文件在 S3 中的 key
   * @returns 文件的访问 URL
   */
  // private getFileUrl(key: string): string {
  //   // todo: 产生url
  //   return `https://${this.bucketName}.s3.${this.config.region}.amazonaws.com/${key}`;
  // }
}
