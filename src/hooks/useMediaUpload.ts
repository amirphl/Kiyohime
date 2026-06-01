import { useCallback, useRef, useState } from 'react';
import { useToast } from './useToast';
import { apiService } from '../services/api';

type UseMediaUploadMessages = {
  notAuthenticated: string;
  uploadFailed: string;
};

export const useMediaUpload = (
  accessToken: string | null,
  messages?: UseMediaUploadMessages
) => {
  const { showError } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const uploadInFlightRef = useRef(false);
  const messagesRef = useRef<UseMediaUploadMessages>({
    notAuthenticated: messages?.notAuthenticated || 'Please log in again',
    uploadFailed: messages?.uploadFailed || 'Failed to upload media',
  });

  messagesRef.current = {
    notAuthenticated:
      messages?.notAuthenticated || messagesRef.current.notAuthenticated,
    uploadFailed: messages?.uploadFailed || messagesRef.current.uploadFailed,
  };

  const uploadMedia = useCallback(
    async (file: File) => {
      if (!accessToken) {
        showError(messagesRef.current.notAuthenticated);
        return null;
      }
      if (uploadInFlightRef.current) return null;

      uploadInFlightRef.current = true;
      setIsUploading(true);
      try {
        apiService.setAccessToken(accessToken);
        const res = await apiService.uploadMultimedia(file);
        if (!res.success || !res.data?.uuid) {
          showError(res.message || messagesRef.current.uploadFailed);
          return null;
        }
        return res.data.uuid;
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : messagesRef.current.uploadFailed;
        showError(message);
        return null;
      } finally {
        setIsUploading(false);
        uploadInFlightRef.current = false;
      }
    },
    [accessToken, showError]
  );

  return {
    uploadMedia,
    isUploading,
  };
};
