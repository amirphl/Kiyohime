import React, { useEffect, useRef, useState } from 'react';
import { apiService } from '../../../services/api';

interface MediaPreviewCellProps {
  uuid?: string;
  accessToken: string | null;
  onError: (message: string) => void;
  labels: {
    loading: string;
    empty: string;
    unavailable: string;
    previewFailed: string;
  };
}

const MediaPreviewCell: React.FC<MediaPreviewCellProps> = ({
  uuid,
  accessToken,
  onError,
  labels,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const lastUuidRef = useRef<string | undefined>(undefined);
  const requestInFlightRef = useRef<Set<string>>(new Set());
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
    if (!accessToken) {
      setPreviewUrl(null);
      setLoading(false);
      return;
    }
    if (lastUuidRef.current === uuid) return;
    if (requestInFlightRef.current.has(uuid)) return;
    setPreviewUrl(prev => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
    let isActive = true;
    setLoading(true);
    requestInFlightRef.current.add(uuid);
    apiService.setAccessToken(accessToken);
    apiService
      .previewMultimedia(uuid)
      .then(res => {
        if (!isActive) return;
        if (!res.success || !res.blob) {
          lastUuidRef.current = uuid;
          setLoading(false);
          onErrorRef.current(res.message || labels.previewFailed);
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
        setLoading(false);
        onErrorRef.current(labels.previewFailed);
      })
      .finally(() => {
        requestInFlightRef.current.delete(uuid);
      });
    return () => {
      isActive = false;
    };
  }, [accessToken, labels.previewFailed, uuid]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!uuid) {
    return <span className='text-sm text-gray-500'>{labels.empty}</span>;
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
    return <span className='text-xs text-gray-500'>{labels.loading}</span>;
  }

  return <span className='text-xs text-gray-500'>{labels.unavailable}</span>;
};

export default MediaPreviewCell;
