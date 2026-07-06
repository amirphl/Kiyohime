import React, { useEffect, useState } from 'react';
import { apiService } from '../../../../services/api';

interface ReportMediaPreviewProps {
  accessToken: string | null;
  mediaUuid?: string | null;
  labels: {
    loading: string;
    empty: string;
    failed: string;
  };
}

const ReportMediaPreview: React.FC<ReportMediaPreviewProps> = ({
  accessToken,
  mediaUuid,
  labels,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mediaUuid || !accessToken) {
      setPreviewUrl(null);
      setMimeType('');
      setLoading(false);
      setError(null);
      return;
    }

    let isActive = true;
    setLoading(true);
    setError(null);
    apiService.setAccessToken(accessToken);

    apiService
      .previewMultimedia(mediaUuid)
      .then(response => {
        if (!isActive) return;
        if (!response.success || !response.blob) {
          setError(response.message || labels.failed);
          return;
        }

        const nextUrl = URL.createObjectURL(response.blob);
        setPreviewUrl(previousUrl => {
          if (previousUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(previousUrl);
          }
          return nextUrl;
        });
        setMimeType(response.blob.type || '');
      })
      .catch(() => {
        if (!isActive) return;
        setError(labels.failed);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [accessToken, labels.failed, mediaUuid]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!mediaUuid) {
    return <span className='text-sm text-slate-500'>{labels.empty}</span>;
  }

  if (loading) {
    return <span className='text-sm text-slate-500'>{labels.loading}</span>;
  }

  if (!previewUrl || error) {
    return (
      <span className='text-sm text-slate-500'>{error || labels.failed}</span>
    );
  }

  if (mimeType.startsWith('video/')) {
    return (
      <video
        src={previewUrl}
        controls
        className='max-h-80 w-full rounded-2xl border border-slate-200 bg-slate-950'
      />
    );
  }

  return (
    <img
      src={previewUrl}
      alt='Campaign media preview'
      className='max-h-80 w-full rounded-2xl border border-slate-200 object-contain bg-slate-100'
    />
  );
};

export default ReportMediaPreview;
