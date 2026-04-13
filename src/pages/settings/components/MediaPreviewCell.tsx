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

  useEffect(() => {
    if (!uuid) {
      setPreviewUrl(null);
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
          onError(res.message || 'Failed to load preview');
          return;
        }
        const url = URL.createObjectURL(res.blob);
        setPreviewUrl(prev => {
          if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
          return url;
        });
        lastUuidRef.current = uuid;
      })
      .catch(() => {
        if (isActive) onError('Failed to load preview');
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [accessToken, onError, uuid]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!uuid) {
    return <span className='text-sm text-gray-500'>—</span>;
  }

  if (loading) {
    return <span className='text-xs text-gray-500'>Loading…</span>;
  }

  if (!previewUrl) {
    return <span className='text-xs text-gray-500'>No preview</span>;
  }

  return (
    <img
      src={previewUrl}
      alt='media preview'
      className='h-10 w-16 object-cover rounded border border-gray-200'
    />
  );
};

export default MediaPreviewCell;
