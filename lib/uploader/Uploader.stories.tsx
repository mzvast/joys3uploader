import React from 'react';
import { Meta } from '@storybook/react';
import Uploader, { ConfigType } from './Uploader';

// 定义 metadata
export default {
  title: 'Components/Uploader',
  component: Uploader,
} satisfies Meta<typeof Uploader>;

// 模拟 S3UploaderConfig 配置
const mockS3UploaderConfig: ConfigType = {
  bucketName: 'example-bucket',
  region: 'us-west-2',
  credentials: {
    accessKeyId: 'mock-access-key-id',
    secretAccessKey: 'mock-secret-access-key',
    sessionToken: '',
  },
  endpoint: 'https://s3-internal.cn-north-1.xx-oss.com',
  key: 'abc.mp4',
};

// Default Story
export const Primary = {
  args: {
    config: mockS3UploaderConfig,
  },
};
