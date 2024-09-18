/**
 * @file [Uploader]
 * @author [mzvast]
 * @email [mzvast@gmail.com]
 * @create date 2024-09-10 15:59:07
 */
import React, { useRef, useState, type PropsWithChildren } from 'react';
import { S3Uploader } from './S3Uploader';
import type { IConfig } from './S3Uploader';
interface IRequired {
  key: string;
  bucketName: string;
}
export type ConfigType = Partial<IConfig> & IRequired;
export type Props = {
  accept?: string;
  autoUpload?: boolean;
  beforeUpload?: (file: File) => Promise<boolean>;
  getConfig?: (file: File) => Promise<ConfigType>;
  config?: ConfigType;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
  onProgress?: (file: File, progress: number) => void;
};
const Uploader: React.FC<PropsWithChildren<Props>> = ({
  accept,
  autoUpload = true,
  beforeUpload,
  getConfig,
  config,
  onError,
  onProgress,
  onSuccess,
  children,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploaderRef = useRef<S3Uploader>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
      if (autoUpload) handleUpload(event.target.files[0]);
    }
  };

  const handleUpload = async (file) => {
    if (beforeUpload) {
      const isValid = await beforeUpload(file);
      if (!isValid) return;
    }

    if (!file) {
      alert('请先选择一个文件');
      return;
    }
    let _config: ConfigType;
    // init uploader

    if (getConfig) {
      _config = await getConfig(file);
    } else {
      _config = config;
    }
    if (!_config) throw new Error('no config or getConfig');

    if (!uploaderRef.current) {
      uploaderRef.current = new S3Uploader(_config);
    } else {
      uploaderRef.current.init(_config);
    }

    try {
      const uploader = uploaderRef.current;
      setUploading(true);
      const url = await uploader.uploadFile({
        file,
        key: _config.key,
        onProgress: (percentage) => {
          onProgress?.(file, percentage);
          setProgress(percentage);
        },
        // onSuccess(url) {
        //     onSuccess?.(url);
        //     console.log('上传成功！', url);
        // },
        // onError: onError
      });
      onSuccess?.(url);
    } catch (error) {
      onError?.(error);
      console.error('上传失败', error);
    } finally {
      setUploading(false);
    }
  };

  const inputRef = useRef<HTMLInputElement>();

  const handleClick = (e) => {
    inputRef?.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFile(files[0]);
      if (autoUpload) handleUpload(files[0]);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        style={{ display: children ? 'none' : 'block' }}
        ref={inputRef}
        accept={accept}
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {children ? (
        children
      ) : (
        <>
          <button
            onClick={handleUpload}
            disabled={uploading}
          >
            上传到 S3
          </button>
          {uploading && <p>上传中... {progress.toFixed(2)}%</p>}
        </>
      )}
    </div>
  );
};

export default Uploader;
