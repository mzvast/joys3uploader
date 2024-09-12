/**
 * @file [Uploader]
 * @author [mzvast]
 * @email [mzvast@gmail.com]
 * @create date 2024-09-10 15:59:07
 */
import React, { useRef, useState } from 'react';
import { S3Uploader, type S3UploaderConfig } from './S3Uploader';
export type Props = {
  config: S3UploaderConfig;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
};
const Uploader: React.FC<Props> = ({ config, onSuccess, onError }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploaderRef = useRef(new S3Uploader(config));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('请先选择一个文件');
      return;
    }

    try {
      const uploader = uploaderRef.current;
      setUploading(true);
      await uploader.uploadFile({
        file,
        key: file.name,
        contentType: file.type,
        onProgress: (percentage) => {
          setProgress(percentage);
        },
        onSuccess(url) {
          onSuccess?.(url);
        },
        onError: onError,
      });
      console.log('上传成功！');
    } catch (error) {
      onError?.(error);
      console.error('上传失败', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
      >
        上传到 S3
      </button>
      {uploading && <p>上传中... {progress.toFixed(2)}%</p>}
    </div>
  );
};

export default Uploader;
