import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { adminPlatformSettingsApi } from './api';

const previewUrlCache = new Map<string, string | null>();
const previewRequestInFlight = new Map<string, Promise<void>>();

type UseAdminMultimediaParams = {
  multimediaUuids: string[];
  onPreviewError: (message: string) => void;
  onDownloadError: (message: string) => void;
  previewErrorFallback: string;
  downloadErrorFallback: string;
};

type PreviewState = Record<string, string | null | undefined>;
type LoadingState = Record<string, boolean>;

export const useAdminMultimedia = ({
  multimediaUuids,
  onPreviewError,
  onDownloadError,
  previewErrorFallback,
  downloadErrorFallback,
}: UseAdminMultimediaParams) => {
  const [previewsByUuid, setPreviewsByUuid] = useState<PreviewState>({});
  const [previewLoadingByUuid, setPreviewLoadingByUuid] =
    useState<LoadingState>({});
  const [downloadLoadingByUuid, setDownloadLoadingByUuid] =
    useState<LoadingState>({});

  const previewErrorRef = useRef(onPreviewError);
  const downloadErrorRef = useRef(onDownloadError);
  const mountedRef = useRef(true);
  const downloadLoadingRef = useRef<LoadingState>({});

  useEffect(() => {
    previewErrorRef.current = onPreviewError;
  }, [onPreviewError]);

  useEffect(() => {
    downloadErrorRef.current = onDownloadError;
  }, [onDownloadError]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    downloadLoadingRef.current = downloadLoadingByUuid;
  }, [downloadLoadingByUuid]);

  const uniqueUuids = useMemo(
    () =>
      Array.from(
        new Set(
          multimediaUuids
            .map(uuid => uuid?.trim())
            .filter((uuid): uuid is string => Boolean(uuid))
        )
      ),
    [multimediaUuids]
  );

  const loadPreview = useCallback(
    async (uuid: string) => {
      if (!uuid) return;
      if (previewUrlCache.has(uuid)) {
        if (!mountedRef.current) return;
        setPreviewsByUuid(prev => ({
          ...prev,
          [uuid]: previewUrlCache.get(uuid),
        }));
        return;
      }

      if (previewRequestInFlight.has(uuid)) {
        if (mountedRef.current) {
          setPreviewLoadingByUuid(prev => ({ ...prev, [uuid]: true }));
        }
        const inFlight = previewRequestInFlight.get(uuid);
        if (inFlight) {
          await inFlight;
        }
        if (!mountedRef.current) return;
        setPreviewLoadingByUuid(prev => ({ ...prev, [uuid]: false }));
        setPreviewsByUuid(prev => ({
          ...prev,
          [uuid]: previewUrlCache.get(uuid),
        }));
        return;
      }

      if (mountedRef.current) {
        setPreviewLoadingByUuid(prev => ({ ...prev, [uuid]: true }));
      }

      const request = (async () => {
        const res = await adminPlatformSettingsApi.previewMultimedia(uuid);
        if (!res.success || !res.blob) {
          previewUrlCache.set(uuid, null);
          previewErrorRef.current(res.message || previewErrorFallback);
          return;
        }
        const previousUrl = previewUrlCache.get(uuid);
        if (previousUrl && previousUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previousUrl);
        }
        const url = URL.createObjectURL(res.blob);
        previewUrlCache.set(uuid, url);
      })()
        .catch(() => {
          previewUrlCache.set(uuid, null);
          previewErrorRef.current(previewErrorFallback);
        })
        .finally(() => {
          previewRequestInFlight.delete(uuid);
        });

      previewRequestInFlight.set(uuid, request);
      await request;
      if (!mountedRef.current) return;
      setPreviewLoadingByUuid(prev => ({ ...prev, [uuid]: false }));
      setPreviewsByUuid(prev => ({
        ...prev,
        [uuid]: previewUrlCache.get(uuid),
      }));
    },
    [previewErrorFallback]
  );

  useEffect(() => {
    if (uniqueUuids.length === 0) return;
    uniqueUuids.forEach(uuid => {
      loadPreview(uuid);
    });
  }, [loadPreview, uniqueUuids]);

  const downloadByUuid = useCallback(
    async (uuid?: string | null) => {
      if (!uuid) return;
      if (downloadLoadingRef.current[uuid]) return;

      if (mountedRef.current) {
        setDownloadLoadingByUuid(prev => ({ ...prev, [uuid]: true }));
      }
      try {
        const res = await adminPlatformSettingsApi.downloadMultimedia(uuid);
        if (!res.success || !res.blob) {
          downloadErrorRef.current(res.message || downloadErrorFallback);
          return;
        }
        const url = URL.createObjectURL(res.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = res.filename || 'multimedia';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch {
        downloadErrorRef.current(downloadErrorFallback);
      } finally {
        if (mountedRef.current) {
          setDownloadLoadingByUuid(prev => ({ ...prev, [uuid]: false }));
        }
      }
    },
    [downloadErrorFallback]
  );

  useEffect(() => {
    return () => {
      previewUrlCache.forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      previewUrlCache.clear();
      previewRequestInFlight.clear();
    };
  }, []);

  return {
    previewsByUuid,
    previewLoadingByUuid,
    downloadLoadingByUuid,
    downloadByUuid,
  };
};
