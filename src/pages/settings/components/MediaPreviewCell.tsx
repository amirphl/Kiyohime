import React, { useEffect, useRef, useState } from 'react';
import { apiService } from '../../../services/api';

interface MediaPreviewCellProps {
  uuid?: string;
  accessToken: string | null;
  onError: (message: string) => void;
}

const MediaPreviewCell: React.FC<MediaPreviewCellProps> = ({ uuid, accessToken, onError }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const lastUuidRef = useRef<string | undefined>(undefined);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (!uuid) {
      setPreviewUrl(null);
      setLoading(false);
      lastUuidRef.current = undefined;
      return;
    }
    if (!accessToken) return;
    if (lastUuidRef.current === uuid) return;
    setPreviewUrl(prev => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
    let isActive = true;
    setLoading(true);
    apiService.setAccessToken(accessToken);
    apiService.previewMultimedia(uuid)
      .then(res => {
        if (!isActive) return;
        if (!res.success || !res.blob) {
          lastUuidRef.current = uuid;
          onErrorRef.current(res.message || 'Failed to load preview');
          return;
        }
        const url = URL.createObjectURL(res.blob);
        setPreviewUrl(prev => {
          if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
          return url;
        });
        lastUuidRef.current = uuid;
        setLoading(false);
      })
      .catch(() => {
        if (!isActive) return;
        lastUuidRef.current = uuid;
        onErrorRef.current('Failed to load preview');
      });
    return () => {
      isActive = false;
    };
  }, [accessToken, uuid]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!uuid) {
    return <span className='text-sm text-gray-500'>—</span>;
  }

  if (previewUrl) {
    return (
      <img
        src={previewUrl}
        alt='media preview'
        className='h-10 w-16 object-cover rounded border border-gray-200'
      />
    );
  }

  if (loading) {
    return <span className='text-xs text-gray-500'>Loading…</span>;
  }

  return <span className='text-xs text-gray-500'>No preview</span>;
};

export default MediaPreviewCell;
