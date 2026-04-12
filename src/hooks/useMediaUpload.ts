import { useCallback, useRef, useState } from 'react';
import { useToast } from './useToast';
import { apiService } from '../services/api';

export const useMediaUpload = (accessToken: string | null) => {
  const { showError } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const uploadInFlightRef = useRef(false);

  const uploadMedia = useCallback(async (file: File) => {
    if (!accessToken) {
      showError('Please log in again');
      return null;
    }
    if (uploadInFlightRef.current) return null;

    uploadInFlightRef.current = true;
    setIsUploading(true);
    try {
      apiService.setAccessToken(accessToken);
      const res = await apiService.uploadMultimedia(file);
      if (!res.success || !res.data?.uuid) {
        showError(res.message || 'Failed to upload media');
        return null;
      }
      return res.data.uuid;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload media';
      showError(message);
      return null;
    } finally {
      setIsUploading(false);
      uploadInFlightRef.current = false;
    }
  }, [accessToken, showError]);

  return {
    uploadMedia,
    isUploading,
  };
};
