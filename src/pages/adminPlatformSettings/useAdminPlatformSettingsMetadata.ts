import { useCallback, useEffect, useRef, useState } from 'react';
import { adminPlatformSettingsApi } from './api';

export type PlatformMetadataKey = 'bale_bot_id' | 'test_key';

type MetadataFormState = {
  key: PlatformMetadataKey;
  value: string;
};

type UseAdminPlatformSettingsMetadataParams = {
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  onMetadataUpdated: (id: number, metadata: Record<string, any>) => void;
  errors: {
    keyRequired: string;
    valueRequired: string;
    updateFailed: string;
  };
  success: {
    metadataUpdated: string;
  };
};

const DEFAULT_KEY: PlatformMetadataKey = 'bale_bot_id';

export const METADATA_KEY_OPTIONS: PlatformMetadataKey[] = [
  'bale_bot_id',
  'test_key',
];

export const useAdminPlatformSettingsMetadata = ({
  onError,
  onSuccess,
  onMetadataUpdated,
  errors,
  success,
}: UseAdminPlatformSettingsMetadataParams) => {
  const [formById, setFormById] = useState<Record<number, MetadataFormState>>(
    {}
  );
  const [loadingById, setLoadingById] = useState<Record<number, boolean>>({});

  const onErrorRef = useRef(onError);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onErrorRef.current = onError;
    onSuccessRef.current = onSuccess;
  }, [onError, onSuccess]);

  const getForm = useCallback(
    (id: number): MetadataFormState => formById[id] || { key: DEFAULT_KEY, value: '' },
    [formById]
  );

  const setKey = useCallback((id: number, key: PlatformMetadataKey) => {
    setFormById(prev => ({
      ...prev,
      [id]: { ...(prev[id] || { key: DEFAULT_KEY, value: '' }), key },
    }));
  }, []);

  const setValue = useCallback((id: number, value: string) => {
    setFormById(prev => ({
      ...prev,
      [id]: { ...(prev[id] || { key: DEFAULT_KEY, value: '' }), value },
    }));
  }, []);

  const submit = useCallback(
    async (id: number) => {
      const form = formById[id] || { key: DEFAULT_KEY, value: '' };
      const key = form.key;
      const value = form.value.trim();

      if (!key) {
        onErrorRef.current(errors.keyRequired);
        return;
      }
      if (!value) {
        onErrorRef.current(errors.valueRequired);
        return;
      }
      if (loadingById[id]) return;

      setLoadingById(prev => ({ ...prev, [id]: true }));
      try {
        const res = await adminPlatformSettingsApi.addMetadata({
          id,
          key,
          value,
        });
        if (!res.success || !res.data) {
          onErrorRef.current(res.message || errors.updateFailed);
          return;
        }
        onMetadataUpdated(id, res.data.metadata || {});
        setFormById(prev => ({
          ...prev,
          [id]: { ...(prev[id] || { key: DEFAULT_KEY, value: '' }), value: '' },
        }));
        onSuccessRef.current(res.message || success.metadataUpdated);
      } catch {
        onErrorRef.current(errors.updateFailed);
      } finally {
        setLoadingById(prev => ({ ...prev, [id]: false }));
      }
    },
    [
      errors.keyRequired,
      errors.updateFailed,
      errors.valueRequired,
      formById,
      loadingById,
      onMetadataUpdated,
      success.metadataUpdated,
    ]
  );

  return {
    getForm,
    setKey,
    setValue,
    submit,
    loadingById,
    keyOptions: METADATA_KEY_OPTIONS,
  };
};
