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
  multimediaUuid: string | null;
  fileName: string | null;
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

const initialState: State = {
  selectedPlatform: 'bale',
  items: [],
  listLoading: false,
  listError: null,
  createLoading: false,
  form: {
    name: '',
    description: '',
    multimediaUuid: null,
    fileName: null,
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

export const usePlatformSettings = (accessToken: string | null) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { showError, showSuccess } = useToast();
  const showErrorRef = useRef(showError);
  const showSuccessRef = useRef(showSuccess);
  const { uploadMedia, isUploading } = useMediaUpload(accessToken);

  useEffect(() => {
    showErrorRef.current = showError;
    showSuccessRef.current = showSuccess;
  }, [showError, showSuccess]);

  const loadList = useCallback(async () => {
    if (!accessToken) return;
    dispatch({ type: 'list-start' });
    try {
      apiService.setAccessToken(accessToken);
      const res = await apiService.listPlatformSettings();
      if (!res.success || !res.data) {
        const message = res.message || 'Failed to load platform settings';
        dispatch({ type: 'list-error', payload: message });
        showErrorRef.current(message);
        return;
      }
      dispatch({ type: 'list-success', payload: res.data.items || [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error';
      dispatch({ type: 'list-error', payload: message });
      showErrorRef.current(message);
    }
  }, [accessToken]);

  useEffect(() => {
    loadList();
  }, [loadList]);

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

  const createSetting = async () => {
    if (!accessToken) {
      showErrorRef.current('Please log in again');
      return;
    }
    if (!state.form.name.trim()) {
      showErrorRef.current('Name is required');
      return;
    }
    if (!state.form.description.trim()) {
      showErrorRef.current('Description is required');
      return;
    }
    if (!state.form.multimediaUuid) {
      showErrorRef.current('Multimedia is required');
      return;
    }
    if (state.form.name && state.form.name.length > 255) {
      showErrorRef.current('Name must be at most 255 characters');
      return;
    }
    const payload: CreatePlatformSettingsRequest = {
      platform: state.selectedPlatform,
      name: state.form.name?.trim() || undefined,
      description: state.form.description?.trim() || undefined,
      multimedia_uuid: state.form.multimediaUuid || undefined,
    };

    dispatch({ type: 'create-start' });
    try {
      apiService.setAccessToken(accessToken);
      const res = await apiService.createPlatformSettings(payload);
      if (!res.success || !res.data) {
        showErrorRef.current(res.message || 'Failed to create platform settings');
        return;
      }
      showSuccessRef.current(res.message || 'Platform settings created');
      resetForm();
      loadList();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error';
      showErrorRef.current(message);
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
    openEdit,
    closeEdit,
  };
};
