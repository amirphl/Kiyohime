import { useCallback, useEffect, useReducer, useRef } from 'react';
import { apiService } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import {
  CreatePlatformSettingsRequest,
  PlatformKey,
  PlatformSettingsItem,
} from '../../types/platformSettings';

type FormState = {
  name: string;
  description: string;
  website: string;
  multimediaUuid: string | null;
  fileName: string | null;
  businessLicenseUuid: string | null;
  businessLicenseFileName: string | null;
};

type State = {
  selectedPlatform: PlatformKey;
  items: PlatformSettingsItem[];
  listLoading: boolean;
  listError: string | null;
  createLoading: boolean;
  form: FormState;
  editItem: PlatformSettingsItem | null;
};

type Action =
  | { type: 'set-platform'; payload: PlatformKey }
  | { type: 'list-start' }
  | { type: 'list-success'; payload: PlatformSettingsItem[] }
  | { type: 'list-error'; payload: string }
  | { type: 'create-start' }
  | { type: 'create-end' }
  | { type: 'form-update'; payload: Partial<FormState> }
  | { type: 'form-reset' }
  | { type: 'edit-open'; payload: PlatformSettingsItem }
  | { type: 'edit-close' };

export type PlatformSettingsErrorCodes = Partial<Record<string, string>>;

type UsePlatformSettingsCopy = {
  api: {
    listFailed: string;
    createFailed: string;
    uploadFailed: string;
  };
  common: {
    notAvailable: string;
  };
  createSuccessToast: string;
  errorCodes: PlatformSettingsErrorCodes;
  validation: {
    nameRequired: string;
    descriptionRequired: string;
    descriptionTooLong: string;
    multimediaRequired: string;
    websiteRequired: string;
    websiteTooLong: string;
    businessLicenseRequired: string;
    nameTooLong: string;
    notAuthenticated: string;
    networkError: string;
  };
};

const DESCRIPTION_MAX_LENGTH = 512;
const WEBSITE_MAX_LENGTH = 512;

type FormValidationResult =
  | {
      valid: true;
      payload: CreatePlatformSettingsRequest;
    }
  | {
      valid: false;
      message: string;
    };

const initialState: State = {
  selectedPlatform: 'bale',
  items: [],
  listLoading: false,
  listError: null,
  createLoading: false,
  form: {
    name: '',
    description: '',
    website: '',
    multimediaUuid: null,
    fileName: null,
    businessLicenseUuid: null,
    businessLicenseFileName: null,
  },
  editItem: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'set-platform':
      return { ...state, selectedPlatform: action.payload };
    case 'list-start':
      return { ...state, listLoading: true, listError: null };
    case 'list-success':
      return { ...state, listLoading: false, items: action.payload };
    case 'list-error':
      return { ...state, listLoading: false, listError: action.payload };
    case 'create-start':
      return { ...state, createLoading: true };
    case 'create-end':
      return { ...state, createLoading: false };
    case 'form-update':
      return { ...state, form: { ...state.form, ...action.payload } };
    case 'form-reset':
      return { ...state, form: initialState.form };
    case 'edit-open':
      return { ...state, editItem: action.payload };
    case 'edit-close':
      return { ...state, editItem: null };
    default:
      return state;
  }
};

export const usePlatformSettings = (
  accessToken: string | null,
  copy: UsePlatformSettingsCopy
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { showError, showSuccess } = useToast();
  const showErrorRef = useRef(showError);
  const showSuccessRef = useRef(showSuccess);
  const lastAccessTokenRef = useRef<string | null>(accessToken);
  const initialLoadDoneRef = useRef(false);
  const listRequestInFlightRef = useRef(false);
  const { uploadMedia, isUploading } = useMediaUpload(accessToken, {
    notAuthenticated: copy.validation.notAuthenticated,
    uploadFailed: copy.api.uploadFailed,
  });
  const {
    uploadMedia: uploadBusinessLicenseMedia,
    isUploading: isBusinessLicenseUploading,
  } = useMediaUpload(accessToken, {
    notAuthenticated: copy.validation.notAuthenticated,
    uploadFailed: copy.api.uploadFailed,
  });

  const resolveError = useRef(
    (code: string | undefined, fallback: string): string =>
      (code && copy.errorCodes[code]) || fallback
  );
  useEffect(() => {
    resolveError.current = (code, fallback) =>
      (code && copy.errorCodes[code]) || fallback;
  }, [copy.errorCodes]);

  useEffect(() => {
    showErrorRef.current = showError;
    showSuccessRef.current = showSuccess;
  }, [showError, showSuccess]);

  useEffect(() => {
    if (lastAccessTokenRef.current === accessToken) return;
    lastAccessTokenRef.current = accessToken;
    initialLoadDoneRef.current = false;
  }, [accessToken]);

  const validateForm = useCallback(
    (form: FormState, selectedPlatform: PlatformKey): FormValidationResult => {
      const name = form.name.trim();
      const description = form.description.trim();
      const website = form.website.trim();

      if (!name) {
        return { valid: false, message: copy.validation.nameRequired };
      }
      if (!description) {
        return { valid: false, message: copy.validation.descriptionRequired };
      }
      if (description.length > DESCRIPTION_MAX_LENGTH) {
        return { valid: false, message: copy.validation.descriptionTooLong };
      }
      if (!form.multimediaUuid) {
        return { valid: false, message: copy.validation.multimediaRequired };
      }
      if (!website) {
        return { valid: false, message: copy.validation.websiteRequired };
      }
      if (website.length > WEBSITE_MAX_LENGTH) {
        return { valid: false, message: copy.validation.websiteTooLong };
      }
      if (!form.businessLicenseUuid) {
        return {
          valid: false,
          message: copy.validation.businessLicenseRequired,
        };
      }
      if (name.length > 255) {
        return { valid: false, message: copy.validation.nameTooLong };
      }

      return {
        valid: true,
        payload: {
          platform: selectedPlatform,
          name,
          description,
          website,
          multimedia_uuid: form.multimediaUuid,
          business_license_uuid: form.businessLicenseUuid,
        },
      };
    },
    [copy.validation]
  );

  const loadList = useCallback(async () => {
    if (!accessToken) {
      initialLoadDoneRef.current = false;
      dispatch({ type: 'list-success', payload: [] });
      return;
    }
    if (listRequestInFlightRef.current) return;

    listRequestInFlightRef.current = true;
    dispatch({ type: 'list-start' });
    try {
      apiService.setAccessToken(accessToken);
      const res = await apiService.listPlatformSettings();
      if (!res.success || !res.data) {
        const message = resolveError.current(
          res.error?.code,
          copy.api.listFailed
        );
        dispatch({ type: 'list-error', payload: message });
        showErrorRef.current(message);
        return;
      }
      dispatch({ type: 'list-success', payload: res.data.items || [] });
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : copy.validation.networkError;
      dispatch({ type: 'list-error', payload: message });
      showErrorRef.current(message);
    } finally {
      listRequestInFlightRef.current = false;
    }
  }, [accessToken, copy.api.listFailed, copy.validation.networkError]);

  useEffect(() => {
    if (!accessToken || initialLoadDoneRef.current) return;
    initialLoadDoneRef.current = true;
    loadList();
  }, [accessToken, loadList]);

  const setPlatform = (platform: PlatformKey) => {
    dispatch({ type: 'set-platform', payload: platform });
  };

  const setForm = (next: Partial<FormState>) => {
    dispatch({ type: 'form-update', payload: next });
  };

  const resetForm = () => {
    dispatch({ type: 'form-reset' });
  };

  const uploadMultimedia = async (file: File) => {
    setForm({ fileName: file.name, multimediaUuid: null });
    const uuid = await uploadMedia(file);
    if (!uuid) {
      setForm({ fileName: null, multimediaUuid: null });
      return null;
    }
    setForm({ multimediaUuid: uuid });
    return uuid;
  };

  const uploadBusinessLicense = async (file: File) => {
    setForm({ businessLicenseFileName: file.name, businessLicenseUuid: null });
    const uuid = await uploadBusinessLicenseMedia(file);
    if (!uuid) {
      setForm({ businessLicenseFileName: null, businessLicenseUuid: null });
      return null;
    }
    setForm({ businessLicenseUuid: uuid });
    return uuid;
  };

  const createSetting = async () => {
    if (!accessToken) {
      showErrorRef.current(copy.validation.notAuthenticated);
      return false;
    }
    const validation = validateForm(state.form, state.selectedPlatform);
    if (!validation.valid) {
      showErrorRef.current(validation.message);
      return false;
    }

    dispatch({ type: 'create-start' });
    try {
      apiService.setAccessToken(accessToken);
      const res = await apiService.createPlatformSettings(validation.payload);
      if (!res.success || !res.data) {
        showErrorRef.current(
          resolveError.current(res.error?.code, copy.api.createFailed)
        );
        return false;
      }
      showSuccessRef.current(copy.createSuccessToast);
      resetForm();
      await loadList();
      return true;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : copy.validation.networkError;
      showErrorRef.current(message);
      return false;
    } finally {
      dispatch({ type: 'create-end' });
    }
  };

  const openEdit = (item: PlatformSettingsItem) => {
    dispatch({ type: 'edit-open', payload: item });
  };

  const closeEdit = () => {
    dispatch({ type: 'edit-close' });
  };

  return {
    state,
    setPlatform,
    setForm,
    resetForm,
    loadList,
    createSetting,
    uploadMultimedia,
    isUploading,
    uploadBusinessLicense,
    isBusinessLicenseUploading,
    validateForm,
    commonCopy: copy.common,
    openEdit,
    closeEdit,
  };
};
