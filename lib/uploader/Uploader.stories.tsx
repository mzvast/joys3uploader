// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Meta } from '@storybook/react';
import Uploader from './Uploader';
import { IConfig } from './S3Uploader';

// 定义 metadata
export default {
  title: 'Components/Uploader',
  component: Uploader,
} satisfies Meta<typeof Uploader>;

// 模拟 S3UploaderConfig 配置
const mockS3UploaderConfig: IConfig = {
  bucketName: 'example-bucket',
  region: 'us-west-2',
  credentials: {
    accessKeyId: 'mock-access-key-id',
    secretAccessKey: 'mock-secret-access-key',
    sessionToken: '',
  },
  endpoint: 's3-internal.cn-north-1.jdcloud-oss.com',
};

// Default Story
export const Primary = {
  args: {
    config: mockS3UploaderConfig,
    onSuccess: (url: string) => {
      alert(`文件上传成功，URL: ${url}`);
    },
    onError: (error: Error) => {
      alert(`文件上传失败: ${error.message}`);
    },
  },
};
