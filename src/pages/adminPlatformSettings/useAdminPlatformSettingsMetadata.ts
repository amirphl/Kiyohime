import { useCallback, useEffect, useRef, useState } from 'react';
import { adminPlatformSettingsApi } from './api';
import { AdminPlatformKey } from '../../types/admin';

export type PlatformMetadataKey =
  | 'bale_bot_id'
  | 'rubika_bot_id'
  | 'splus_bot_id'
  | 'test_key';

type MetadataFormState = {
  key: PlatformMetadataKey;
  value: string;
};

type UseAdminPlatformSettingsMetadataParams = {
  getPlatformById: (id: number) => AdminPlatformKey | null | undefined;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  onMetadataUpdated: (id: number, metadata: Record<string, any>) => void;
  errors: {
    keyRequired: string;
    valueRequired: string;
    keyNotAllowedForPlatform: string;
    updateFailed: string;
  };
  success: {
    metadataUpdated: string;
  };
};

const DEFAULT_KEY: PlatformMetadataKey = 'bale_bot_id';

export const METADATA_KEY_OPTIONS: PlatformMetadataKey[] = [
  'bale_bot_id',
  'rubika_bot_id',
  'splus_bot_id',
  'test_key',
];

const PLATFORM_KEY_PREFIX: Record<'bale' | 'rubika' | 'splus', string> = {
  bale: 'bale_',
  rubika: 'rubika_',
  splus: 'splus_',
};

const getKeyPrefixByPlatform = (platform?: AdminPlatformKey | null): string | null => {
  if (!platform) return null;
  const normalized = String(platform).toLowerCase();
  if (normalized === 'bale') return PLATFORM_KEY_PREFIX.bale;
  if (normalized === 'rubika') return PLATFORM_KEY_PREFIX.rubika;
  if (normalized === 'splus') return PLATFORM_KEY_PREFIX.splus;
  return null;
};

const isKeyAllowedForPlatform = (
  key: string,
  platform?: AdminPlatformKey | null
): boolean => {
  const prefix = getKeyPrefixByPlatform(platform);
  if (!prefix) return true;
  return key.startsWith(prefix);
};

const firstAllowedKeyForPlatform = (
  platform?: AdminPlatformKey | null
): PlatformMetadataKey => {
  const options = getMetadataKeyOptionsForPlatform(platform);
  return options[0] || DEFAULT_KEY;
};

export const getMetadataKeyOptionsForPlatform = (
  platform?: AdminPlatformKey | null
): PlatformMetadataKey[] => {
  const prefix = getKeyPrefixByPlatform(platform);
  if (!prefix) return METADATA_KEY_OPTIONS;
  return METADATA_KEY_OPTIONS.filter(key => key.startsWith(prefix));
};

export const useAdminPlatformSettingsMetadata = ({
  getPlatformById,
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
  const getPlatformByIdRef = useRef(getPlatformById);

  useEffect(() => {
    onErrorRef.current = onError;
    onSuccessRef.current = onSuccess;
    getPlatformByIdRef.current = getPlatformById;
  }, [getPlatformById, onError, onSuccess]);

  const getForm = useCallback(
    (id: number): MetadataFormState => {
      const platform = getPlatformByIdRef.current(id);
      const currentForm = formById[id];
      const defaultKey = firstAllowedKeyForPlatform(platform);
      if (!currentForm) return { key: defaultKey, value: '' };
      if (!isKeyAllowedForPlatform(currentForm.key, platform)) {
        return { ...currentForm, key: defaultKey };
      }
      return currentForm;
    },
    [formById]
  );

  const setKey = useCallback((id: number, key: PlatformMetadataKey) => {
    const platform = getPlatformByIdRef.current(id);
    if (!isKeyAllowedForPlatform(key, platform)) return;
    setFormById(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {
          key: firstAllowedKeyForPlatform(platform),
          value: '',
        }),
        key,
      },
    }));
  }, []);

  const setValue = useCallback((id: number, value: string) => {
    const platform = getPlatformByIdRef.current(id);
    setFormById(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {
          key: firstAllowedKeyForPlatform(platform),
          value: '',
        }),
        value,
      },
    }));
  }, []);

  const submit = useCallback(
    async (id: number) => {
      const platform = getPlatformByIdRef.current(id);
      const form = formById[id] || {
        key: firstAllowedKeyForPlatform(platform),
        value: '',
      };
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
      if (!isKeyAllowedForPlatform(key, platform)) {
        onErrorRef.current(errors.keyNotAllowedForPlatform);
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
      errors.keyNotAllowedForPlatform,
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
    getKeyOptionsForPlatform: getMetadataKeyOptionsForPlatform,
  };
};
