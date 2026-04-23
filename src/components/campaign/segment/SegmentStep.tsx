import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useCampaign } from '../../../hooks/useCampaign';
import { apiService } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';
import {
  jobCategoryI18n,
  JobCategoryLocale,
} from '../../../locales/jobCategory';
import TitleCard from './TitleCard';
import CapacityCard from './CapacityCard';
import LevelOneCard from './LevelOneCard';
import LevelTwoCard from './LevelTwoCard';
import SegmentPriceFactorsCard from './SegmentPriceFactorsCard';
import PlatformSelectionCard from './PlatformSelectionCard';
import { useAudienceSpec } from './useAudienceSpec';
import {
  getLevel1Options,
  getLevel2Options,
  getLevel3Options,
  getItemTags,
  getLevel2Metadata,
} from './utils';
import {
  LevelSelectionState,
  saveLevelSelection,
  loadLevelSelection,
  createEmptyLevelSelection,
  clearLevelSelection,
} from '../../../types/segment';
import { CampaignData, CampaignPlatform } from '../../../types/campaign';
import { campaignLevelI18n } from './segmentTranslations';
import { useLanguage } from '../../../hooks/useLanguage';
import CategoryJobFields from '../../CategoryJobFields';
import Button from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import { useMediaUpload } from '../../../hooks/useMediaUpload';
import TargetAudienceExcelFileUploadCard, {
  isTargetAudienceExcelFile,
} from './TargetAudienceExcelFileUploadCard';

const LevelStep: React.FC = () => {
  const { language } = useLanguage();
  const t =
    campaignLevelI18n[language as keyof typeof campaignLevelI18n] ||
    campaignLevelI18n.en;
  const {
    campaignData,
    updateLevel,
    updateContent,
    updateBudget,
    setCampaignUuid,
  } = useCampaign();
  const { accessToken, user } = useAuth();
  const { showError } = useToast();
  const { uploadMedia, isUploading } = useMediaUpload(accessToken);
  const showErrorRef = useRef(showError);
  const categories = (jobCategoryI18n[language as JobCategoryLocale] ||
    jobCategoryI18n.en) as Record<string, readonly string[]>;
  const isAgency = user?.account_type === 'marketing_agency';

  // Local state for selections
  const [campaignTitle, setCampaignTitle] = useState<string>(
    campaignData.segment.campaignTitle || ''
  );
  const [platform, setPlatform] = useState<CampaignPlatform>(
    campaignData.segment.platform || 'sms'
  );
  const [level1, setLevel1] = useState<string>(
    campaignData.segment.level1 || ''
  );
  const [level2s, setLevel2s] = useState<string[]>(
    campaignData.segment.level2s || []
  );
  const [level3s, setLevel3s] = useState<string[]>(
    campaignData.segment.level3s || []
  );
  const [capacity, setCapacity] = useState<number>(0);
  const [jobCategory, setJobCategory] = useState<string>(
    campaignData.segment.jobCategory || ''
  );
  const [job, setJob] = useState<string>(campaignData.segment.job || '');
  const [jobErrors, setJobErrors] = useState<{
    category?: string;
    job?: string;
  }>({});
  const [segmentPriceFactors, setSegmentPriceFactors] = useState<
    Record<string, number>
  >({});
  const [targetAudienceExcelFileName, setTargetAudienceExcelFileName] =
    useState<string | null>(null);
  const isTargetAudienceExcelFileModeByValue = (value: unknown): boolean =>
    value !== null && value !== undefined;
  const isTargetAudienceExcelFileMode = isTargetAudienceExcelFileModeByValue(
    campaignData.segment.targetAudienceExcelFileUuid
  );

  // Track if initialization has already happened
  const initializedRef = useRef(false);
  const lastInitiatedFetchedRef = useRef(false);
  const lastInitiatedInFlightRef = useRef(false);
  const campaignDataRef = useRef(campaignData);
  // Fetch audience spec on mount
  const {
    spec: audienceSpec,
    loading: loadingSpec,
    error: specError,
  } = useAudienceSpec(platform);

  useEffect(() => {
    campaignDataRef.current = campaignData;
  }, [campaignData]);

  const hasLocalDraftCampaign = useCallback(() => {
    const current = campaignDataRef.current;
    const currentSegment = current?.segment || {};
    const hasDraftData = (candidate: any): boolean => {
      const segment = candidate?.segment || candidate?.level || {};
      const content = candidate?.content || {};
      const budget = candidate?.budget || {};
      return (
        !!candidate?.uuid ||
        !!segment.campaignTitle ||
        !!segment.level1 ||
        (Array.isArray(segment.level2s) && segment.level2s.length > 0) ||
        (Array.isArray(segment.level3s) && segment.level3s.length > 0) ||
        isTargetAudienceExcelFileModeByValue(
          segment.targetAudienceExcelFileUuid
        ) ||
        !!segment.jobCategory ||
        !!segment.job ||
        !!content.text ||
        !!content.link ||
        !!content.scheduleAt ||
        !!content.lineNumber ||
        !!content.platformSettingsId ||
        !!content.mediaUuid ||
        (typeof budget.totalBudget === 'number' && budget.totalBudget > 0)
      );
    };

    const inState =
      hasDraftData(current) ||
      !!campaignTitle ||
      !!level1 ||
      (Array.isArray(level2s) && level2s.length > 0) ||
      (Array.isArray(level3s) && level3s.length > 0) ||
      !!jobCategory ||
      !!job ||
      isTargetAudienceExcelFileModeByValue(
        currentSegment.targetAudienceExcelFileUuid // NOTE: vs current.segment
      ) ||
      !!targetAudienceExcelFileName;
    if (inState) return true;

    try {
      const stored = localStorage.getItem('campaign_creation_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (hasDraftData(parsed)) return true;
      }
      const savedSelection = loadLevelSelection();
      if (!savedSelection) return false;
      return (
        !!savedSelection.campaignTitle ||
        savedSelection.level1s.length > 0 ||
        savedSelection.level2s.length > 0 ||
        savedSelection.level3s.length > 0 ||
        isTargetAudienceExcelFileModeByValue(
          savedSelection.targetAudienceExcelFileUuid
        )
      );
    } catch {
      return false;
    }
  }, [
    campaignTitle,
    job,
    jobCategory,
    level1,
    level2s,
    level3s,
    targetAudienceExcelFileName,
  ]);

  const normalizeLastInitiatedCampaign = useCallback(
    (payload: any): CampaignData | null => {
      // Never override in-progress local edits with server data.
      if (hasLocalDraftCampaign()) return null;

      const campaign = payload?.item ?? payload?.data ?? payload;
      if (!campaign || typeof campaign !== 'object') return null;

      const status =
        typeof campaign.status === 'string'
          ? campaign.status.toLowerCase()
          : '';
      if (status && status !== 'initiated' && status !== 'in-progress')
        return null;

      const platformValue = (campaign.platform as CampaignPlatform) || 'sms';
      const capacityValue =
        typeof campaign.num_audience === 'number'
          ? campaign.num_audience
          : typeof campaign.capacity === 'number'
            ? campaign.capacity
            : undefined;

      const segment = {
        campaignTitle: campaign.title || '',
        level1: campaign.level1 || '',
        level2s: Array.isArray(campaign.level2s) ? campaign.level2s : [],
        level3s: Array.isArray(campaign.level3s) ? campaign.level3s : [],
        targetAudienceExcelFileUuid:
          campaign.target_audience_excel_file_uuid ?? null,
        platform: platformValue,
        tags: Array.isArray(campaign.tags) ? campaign.tags : [],
        capacityTooLow:
          typeof capacityValue === 'number'
            ? capacityValue > 0 && capacityValue < 500
            : false,
        capacity: capacityValue,
        jobCategory: campaign.job_category || '',
        job: campaign.job || '',
      };

      const content = {
        insertLink: !!campaign.adlink,
        link: campaign.adlink || '',
        text: campaign.content || '',
        scheduleAt: campaign.scheduleat || undefined,
        shortLinkDomain: campaign.short_link_domain || 'jo1n.ir',
        lineNumber: campaign.line_number || '',
        platformSettingsId:
          platformValue === 'sms'
            ? null
            : (campaign.platform_settings_id ?? null),
        mediaUuid:
          platformValue === 'sms' ? null : (campaign.media_uuid ?? null),
      };

      const budget = {
        totalBudget: typeof campaign.budget === 'number' ? campaign.budget : 0,
        estimatedMessages:
          typeof campaign.num_audience === 'number'
            ? campaign.num_audience
            : undefined,
      };

      return {
        uuid: campaign.uuid || '',
        segment,
        content,
        budget,
        payment: { paymentMethod: '', termsAccepted: false },
      };
    },
    [hasLocalDraftCampaign]
  );

  // Ensure API service has token
  useEffect(() => {
    if (accessToken) {
      apiService.setAccessToken(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

  // Fetch last initiated campaign once per visit when no local draft exists
  useEffect(() => {
    if (lastInitiatedFetchedRef.current) return;
    if (lastInitiatedInFlightRef.current) return;
    if (!accessToken) return;
    if (hasLocalDraftCampaign()) return;

    lastInitiatedInFlightRef.current = true;
    let canceled = false;

    const fetchLastInitiatedCampaign = async () => {
      // TODO: Not reviewed
      if (hasLocalDraftCampaign()) return;

      apiService.setAccessToken(accessToken);
      const response = await apiService.getLastInitiatedCampaign();
      //   console.log('0- Fetched last initiated campaign response:', response);
      if (canceled) return;
      //   console.log('1- Fetched last initiated campaign:', response);
      // User might have started typing while the request was in-flight
      if (hasLocalDraftCampaign()) return;
      //   console.log('2- No local draft, processing fetched campaign');

      if (!response.success || !response.data) {
        if (!response.success && response.message) {
          showErrorRef.current(response.message);
        }
        return;
      }
      //   console.log('3- Normalizing last initiated campaign data');

      const normalized = normalizeLastInitiatedCampaign(response.data);
      if (!normalized || !normalized.uuid) return;
      //   console.log('4- Normalized campaign data:', normalized);

      // TODO: Not reviewed
      // Avoid overriding if user created a draft while normalization/persist work is happening.
      if (hasLocalDraftCampaign()) return;

      try {
        localStorage.setItem(
          'campaign_creation_data',
          JSON.stringify(normalized)
        );
        localStorage.setItem('campaign_creation_step', '1');
        saveLevelSelection({
          campaignTitle: normalized.segment.campaignTitle || '',
          level1s: normalized.segment.level1 ? [normalized.segment.level1] : [],
          level2s: normalized.segment.level2s || [],
          level3s: normalized.segment.level3s || [],
          targetAudienceExcelFileUuid:
            normalized.segment.targetAudienceExcelFileUuid ?? null,
          metadata: {},
          tags: normalized.segment.tags || [],
          count: normalized.segment.capacity || 0,
          lastUpdated: new Date().toISOString(),
        });
      } catch (storageError) {
        console.warn('Failed to persist last initiated campaign', storageError);
      }

      setCampaignUuid(normalized.uuid);
      updateLevel(normalized.segment);
      updateContent(normalized.content);
      updateBudget(normalized.budget);

      setCampaignTitle(normalized.segment.campaignTitle || '');
      setPlatform(normalized.segment.platform || 'sms');
      setLevel1(normalized.segment.level1 || '');
      setLevel2s(normalized.segment.level2s || []);
      setLevel3s(normalized.segment.level3s || []);
      setTargetAudienceExcelFileName(
        normalized.segment.targetAudienceExcelFileUuid
          ? t.segmentationByTargetAudienceExcelFileUploaded
          : null
      );
      setCapacity(normalized.segment.capacity || 0);
      setJobCategory(normalized.segment.jobCategory || '');
      setJob(normalized.segment.job || '');

      lastInitiatedFetchedRef.current = true;
    };

    fetchLastInitiatedCampaign()
      .catch(err => {
        if (!canceled) {
          console.warn('Failed to fetch last initiated campaign', err);
        }
      })
      .finally(() => {
        if (!canceled) {
          lastInitiatedInFlightRef.current = false;
        }
      });

    return () => {
      canceled = true;
      lastInitiatedInFlightRef.current = false;
    };
  }, [
    accessToken,
    hasLocalDraftCampaign,
    normalizeLastInitiatedCampaign,
    setCampaignUuid,
    t.segmentationByTargetAudienceExcelFileUploaded,
    updateBudget,
    updateContent,
    updateLevel,
  ]);

  useEffect(() => {
    if (!accessToken) return;
    let canceled = false;
    setSegmentPriceFactors({});

    const fetchPriceFactors = async () => {
      const response = await apiService.listLatestSegmentPriceFactors(platform);
      if (canceled) return;

      if (!response.success || !response.data) {
        showErrorRef.current(
          response.message || 'Failed to load segment price factors'
        );
        return;
      }
      const items = response.data.items || [];
      const nextMap: Record<string, number> = {};
      items.forEach(item => {
        if (item?.level3) {
          nextMap[item.level3] = item.price_factor;
        }
      });
      setSegmentPriceFactors(nextMap);
    };

    fetchPriceFactors();

    return () => {
      canceled = true;
    };
  }, [accessToken, platform]);

  // Initialize from localStorage when spec is loaded (only once)
  // Loads from dedicated level selection storage, with fallback to campaignData
  useEffect(() => {
    if (!audienceSpec || initializedRef.current) return;
    const hasLocalDraft = hasLocalDraftCampaign();
    if (!hasLocalDraft) {
      initializedRef.current = true;
      return;
    }

    // Try to load from dedicated level selection storage first
    const savedSelection = loadLevelSelection();

    if (savedSelection) {
      // Always restore campaignTitle if it exists
      if (!campaignTitle && savedSelection.campaignTitle) {
        setCampaignTitle(savedSelection.campaignTitle);
        updateLevel({ campaignTitle: savedSelection.campaignTitle });
      }

      // Restore level selections if they exist
      if (
        !level1 &&
        level3s.length === 0 &&
        savedSelection.level1s.length > 0 &&
        savedSelection.level3s.length > 0
      ) {
        setLevel1(savedSelection.level1s[0]);
        setLevel2s(savedSelection.level2s);
        setLevel3s(savedSelection.level3s);
        setCapacity(savedSelection.count);
      }

      // Restore target audience excel mode/upload state.
      if (
        campaignData.segment.targetAudienceExcelFileUuid == null &&
        savedSelection.targetAudienceExcelFileUuid != null
      ) {
        const excelFileUuid = savedSelection.targetAudienceExcelFileUuid;
        setTargetAudienceExcelFileName(
          excelFileUuid ? t.segmentationByTargetAudienceExcelFileUploaded : null
        );
        updateLevel({
          targetAudienceExcelFileUuid: excelFileUuid,
        });
      }
    }

    // Mark as initialized
    initializedRef.current = true;
  }, [
    audienceSpec,
    campaignData.segment.targetAudienceExcelFileUuid,
    campaignTitle,
    hasLocalDraftCampaign, // TODO: Not reviewed
    level1,
    level3s.length,
    t.segmentationByTargetAudienceExcelFileUploaded,
    updateLevel,
  ]);

  const ensureDefaultLevelSelection = useCallback(() => {
    const hasLocalDraft = hasLocalDraftCampaign(); // TODO: Not reviewed
    if (!hasLocalDraft) return;
    if (
      !isTargetAudienceExcelFileModeByValue(
        campaignData.segment.targetAudienceExcelFileUuid
      )
    ) {
      return;
    }
    if (!audienceSpec) return;

    const level1Options = getLevel1Options(audienceSpec);
    if (level1Options.length === 0) return;

    const nextLevel1 = level1 || level1Options[0].value;
    const level2Options = getLevel2Options(audienceSpec, nextLevel1);
    const nextLevel2s =
      level2s.length > 0
        ? level2s
        : level2Options.slice(0, 1).map(opt => opt.value);

    const nextLevel3Set = new Set<string>(level3s);
    if (nextLevel3Set.size === 0 && nextLevel2s.length > 0) {
      const firstLevel3Options = getLevel3Options(
        audienceSpec,
        nextLevel1,
        nextLevel2s[0]
      );
      if (firstLevel3Options.length > 0) {
        nextLevel3Set.add(firstLevel3Options[0].value);
      }
    }
    const nextLevel3s = Array.from(nextLevel3Set);

    const hasChanged =
      nextLevel1 !== level1 ||
      nextLevel2s.length !== level2s.length ||
      nextLevel2s.some((item, idx) => item !== level2s[idx]) ||
      nextLevel3s.length !== level3s.length ||
      nextLevel3s.some((item, idx) => item !== level3s[idx]);

    if (!hasChanged) return;

    setLevel1(nextLevel1);
    setLevel2s(nextLevel2s);
    setLevel3s(nextLevel3s);
  }, [
    audienceSpec,
    campaignData.segment.targetAudienceExcelFileUuid,
    hasLocalDraftCampaign, // TODO: Not reviewed
    level1,
    level2s,
    level3s,
  ]);

  useEffect(() => {
    if (!isTargetAudienceExcelFileMode) return;
    ensureDefaultLevelSelection();
  }, [ensureDefaultLevelSelection, isTargetAudienceExcelFileMode]);

  useEffect(() => {
    const targetAudienceExcelFileUuid =
      campaignData.segment.targetAudienceExcelFileUuid;
    if (targetAudienceExcelFileUuid == null) {
      setTargetAudienceExcelFileName(null);
      return;
    }
    if (!targetAudienceExcelFileUuid) {
      setTargetAudienceExcelFileName(null);
      return;
    }
    if (!targetAudienceExcelFileName) {
      setTargetAudienceExcelFileName(
        t.segmentationByTargetAudienceExcelFileUploaded
      );
    }
  }, [
    campaignData.segment.targetAudienceExcelFileUuid,
    targetAudienceExcelFileName,
    t.segmentationByTargetAudienceExcelFileUploaded,
  ]);

  // Auto-select single level3s and calculate capacity/tags when level2s or level3s change
  // Stores to dedicated localStorage: level1s, level2s, level3s, metadata, tags, count
  useEffect(() => {
    if (!audienceSpec || !level1 || level2s.length === 0) {
      setCapacity(0);
      return;
    }

    // Auto-select level3s where only one exists
    const newL3s = new Set<string>(level3s);
    level2s.forEach(l2 => {
      const l3Options = getLevel3Options(audienceSpec, level1, l2);
      if (l3Options.length === 1) {
        newL3s.add(l3Options[0].value);
      }
    });

    // Update level3s if auto-selection added new ones
    const l3Array = Array.from(newL3s);
    if (
      l3Array.length !== level3s.length ||
      !l3Array.every(l3 => level3s.includes(l3))
    ) {
      setLevel3s(l3Array);
      return; // Exit early to prevent duplicate updates
    }

    // Calculate capacity, collect tags union, and gather metadata from selected level3s
    let totalCapacity = 0;
    const tags = new Set<string>();
    const metadata: Record<string, any> = {};

    level2s.forEach(l2 => {
      // Collect metadata for this level2
      const l2Meta = getLevel2Metadata(audienceSpec, level1, l2);
      if (l2Meta) {
        metadata[l2] = l2Meta;
      }

      const l3Options = getLevel3Options(audienceSpec, level1, l2).map(
        opt => opt.value
      );
      const selectedForL3 = l3Array.filter(l3 => l3Options.includes(l3));

      selectedForL3.forEach(l3 => {
        const item = (audienceSpec as any)?.[level1]?.[l2]?.items?.[l3];
        const count =
          typeof item?.available_audience === 'number'
            ? item.available_audience
            : 0;
        totalCapacity += count;

        // Collect tags from each selected level3 item
        const itemTags = getItemTags(audienceSpec, level1, l2, l3);
        itemTags.forEach(tag => tags.add(tag));

        // Store level3 item metadata
        if (item) {
          metadata[`${l2}.${l3}`] = {
            tags: item.tags || [],
            available_audience: item.available_audience || 0,
          };
        }
      });
    });

    setCapacity(totalCapacity);

    // Create level selection state
    const selectionState: LevelSelectionState = {
      campaignTitle: campaignTitle,
      level1s: [level1],
      level2s: level2s,
      level3s: l3Array,
      targetAudienceExcelFileUuid:
        campaignData.segment.targetAudienceExcelFileUuid ?? null,
      metadata: metadata,
      tags: Array.from(tags),
      count: totalCapacity,
      lastUpdated: new Date().toISOString(),
    };

    // Save to dedicated level selection storage
    saveLevelSelection(selectionState);

    // Also update campaign data for API compatibility
    const capacityTooLow = totalCapacity > 0 && totalCapacity < 500;

    updateLevel({
      level1: level1, // Level 1 selection
      level2s: level2s, // Level 2 selections
      level3s: l3Array, // Level 3 selections
      targetAudienceExcelFileUuid:
        campaignData.segment.targetAudienceExcelFileUuid ?? null,
      tags: Array.from(tags), // Union of tags from selected level3s
      capacity: totalCapacity,
      capacityTooLow: capacityTooLow,
      jobCategory,
      job,
    });
  }, [
    audienceSpec,
    level1,
    level2s,
    level3s,
    campaignData.segment.targetAudienceExcelFileUuid,
    campaignTitle,
    jobCategory,
    job,
    updateLevel,
  ]);

  const handleCampaignTitleChange = (value: string) => {
    setCampaignTitle(value);
    updateLevel({ campaignTitle: value });
  };

  const handleSegmentationModeChange = (
    mode: 'target-audience-excel-file' | 'levels'
  ) => {
    if (mode === 'levels') {
      setTargetAudienceExcelFileName(null);
      updateLevel({ targetAudienceExcelFileUuid: null });
      return;
    }

    updateLevel({
      targetAudienceExcelFileUuid:
        campaignData.segment.targetAudienceExcelFileUuid ?? '',
    });
    ensureDefaultLevelSelection();
  };

  const handleTargetAudienceExcelFileUpload = async (file: File) => {
    if (!isTargetAudienceExcelFile(file)) {
      showError(t.segmentationByTargetAudienceExcelFileInvalidType);
      return;
    }

    if (campaignData.segment.targetAudienceExcelFileUuid == null) {
      updateLevel({ targetAudienceExcelFileUuid: '' });
    }
    setTargetAudienceExcelFileName(file.name);
    ensureDefaultLevelSelection();

    const uuid = await uploadMedia(file);
    if (!uuid) {
      updateLevel({ targetAudienceExcelFileUuid: '' });
      return;
    }

    updateLevel({ targetAudienceExcelFileUuid: uuid });
  };

  const handleTargetAudienceExcelFileClear = () => {
    setTargetAudienceExcelFileName(null);
    updateLevel({ targetAudienceExcelFileUuid: '' });
  };

  const handleLevel1Change = (value: string) => {
    setLevel1(value);
    setLevel2s([]);
    setLevel3s([]);
    setCapacity(0);

    // Save empty state to level selection storage (preserve campaignTitle)
    const emptySelection = createEmptyLevelSelection();
    emptySelection.campaignTitle = campaignTitle;
    emptySelection.level1s = [value];
    saveLevelSelection(emptySelection);

    updateLevel({
      level1: value,
      level2s: [],
      level3s: [],
      tags: [],
      capacity: 0,
      capacityTooLow: false,
    });
  };

  const handleLevel2Toggle = (l2: string) => {
    setLevel2s(prev => {
      if (prev.includes(l2)) {
        // Remove level2 and all its associated level3s
        const l3ToRemove = getLevel3Options(
          audienceSpec || null,
          level1,
          l2
        ).map(opt => opt.value);
        setLevel3s(prevL3s => prevL3s.filter(l3 => !l3ToRemove.includes(l3)));
        return prev.filter(item => item !== l2);
      } else {
        return [...prev, l2];
      }
    });
  };

  const handleJobCategoryChange = (value: string) => {
    setJobCategory(value);
    setJob('');
    updateLevel({ jobCategory: value, job: '' });
    setJobErrors(prev => ({
      ...prev,
      category: value ? '' : t.agencyCategoryRequired,
      job: '',
    }));
  };

  const handleJobChange = (value: string) => {
    setJob(value);
    updateLevel({ job: value });
    setJobErrors(prev => ({ ...prev, job: value ? '' : t.agencyJobRequired }));
  };

  const handleLevel3Toggle = (l3: string) => {
    setLevel3s(prev => {
      if (prev.includes(l3)) {
        return prev.filter(item => item !== l3);
      } else {
        return [...prev, l3];
      }
    });
  };

  const handlePlatformChange = (value: CampaignPlatform) => {
    setPlatform(value);
    setLevel1('');
    setLevel2s([]);
    setLevel3s([]);
    setCapacity(0);
    setTargetAudienceExcelFileName(null);
    clearLevelSelection();
    // Platform-specific settings selection from content step must be reset on platform switch.
    updateContent({ platformSettingsId: null });
    updateLevel({
      platform: value,
      level1: '',
      level2s: [],
      level3s: [],
      targetAudienceExcelFileUuid: null,
      tags: [],
      capacity: 0,
      capacityTooLow: false,
    });
  };

  const handleReset = () => {
    if (!hasLocalDraftCampaign()) return;

    // TODO: Not reviewed
    // Keep form empty after reset instead of re-hydrating from last initiated campaign.
    lastInitiatedFetchedRef.current = true;
    lastInitiatedInFlightRef.current = false;

    setCampaignTitle('');
    setPlatform('sms');
    setLevel1('');
    setLevel2s([]);
    setLevel3s([]);
    setCapacity(0);
    setTargetAudienceExcelFileName(null);
    setJobCategory('');
    setJob('');
    setJobErrors({});
    clearLevelSelection();

    updateLevel({
      campaignTitle: '',
      platform: 'sms',
      level1: '',
      level2s: [],
      level3s: [],
      targetAudienceExcelFileUuid: null,
      tags: [],
      capacity: 0,
      capacityTooLow: false,
      jobCategory: '',
      job: '',
    });

    localStorage.removeItem('campaign_creation_data');
    localStorage.removeItem('campaign_creation_step');
  };

  const level1Options = getLevel1Options(audienceSpec || null);
  const level2Options = getLevel2Options(audienceSpec || null, level1);

  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch'>
        {/* Platform Selection */}
        <div className='md:col-span-2'>
          <PlatformSelectionCard
            title={t.platform}
            value={platform}
            onChange={handlePlatformChange}
            options={[
              { value: 'sms', label: t.platformSms },
              { value: 'rubika', label: t.platformRubika },
              { value: 'bale', label: t.platformBale },
              { value: 'splus', label: t.platformSplus },
            ]}
          />
        </div>

        {/* Campaign Title */}
        <div className='md:col-span-2'>
          <TitleCard
            title={campaignTitle || ''}
            onChange={handleCampaignTitleChange}
            label={t.campaignTitleLabel}
            placeholder={t.campaignTitlePlaceholder}
            validationMessage={t.campaignTitleValidation}
          />
        </div>

        {isAgency && (
          <div className='md:col-span-2'>
            <div className='bg-white shadow-sm border border-gray-200 rounded-lg p-4'>
              <CategoryJobFields
                category={jobCategory}
                job={job}
                onChange={(field, value) =>
                  field === 'jobCategory'
                    ? handleJobCategoryChange(value)
                    : handleJobChange(value)
                }
                requiredLabel={<span className='text-red-500'>*</span>}
                strings={{
                  categoryHeader: t.agencyCategoryHeader,
                  category: t.agencyCategory,
                  selectCategory: t.agencySelectCategory,
                  job: t.agencyJob,
                  selectJob: t.agencySelectJob,
                }}
                categories={categories}
                errors={{
                  category:
                    isAgency && !jobCategory
                      ? t.agencyCategoryRequired
                      : jobErrors.category,
                  job: isAgency && !job ? t.agencyJobRequired : jobErrors.job,
                }}
              />
            </div>
          </div>
        )}

        <div className='md:col-span-2'>
          <div className='bg-white shadow-sm border border-gray-200 rounded-lg p-4'>
            <p className='text-sm font-medium text-gray-900 mb-3'>
              {t.segmentationMode}
            </p>
            <div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-6'>
              <label className='inline-flex items-center gap-2 text-sm text-gray-700'>
                <input
                  type='radio'
                  name='segmentationMode'
                  checked={!isTargetAudienceExcelFileMode}
                  onChange={() => handleSegmentationModeChange('levels')}
                />
                <span>{t.segmentationByLevels}</span>
              </label>
              <label className='inline-flex items-center gap-2 text-sm text-gray-700'>
                <input
                  type='radio'
                  name='segmentationMode'
                  checked={isTargetAudienceExcelFileMode}
                  onChange={() =>
                    handleSegmentationModeChange('target-audience-excel-file')
                  }
                />
                <span>{t.segmentationByTargetAudienceExcelFile}</span>
              </label>
            </div>
          </div>
        </div>

        {isTargetAudienceExcelFileMode ? (
          <div className='md:col-span-2'>
            <TargetAudienceExcelFileUploadCard
              label={t.segmentationByTargetAudienceExcelFileTitle}
              help={t.segmentationByTargetAudienceExcelFileHelp}
              uploadingLabel={t.segmentationByTargetAudienceExcelFileUploading}
              uploadedLabel={t.segmentationByTargetAudienceExcelFileUploaded}
              removeLabel={t.segmentationByTargetAudienceExcelFileRemove}
              fileName={targetAudienceExcelFileName}
              isUploading={isUploading}
              onUpload={handleTargetAudienceExcelFileUpload}
              onClear={handleTargetAudienceExcelFileClear}
            />
            {!isUploading &&
              (!campaignData.segment.targetAudienceExcelFileUuid ||
                !campaignData.segment.targetAudienceExcelFileUuid.trim()) && (
                <p className='text-sm text-red-600 mt-2'>
                  {t.segmentationByTargetAudienceExcelFileRequired}
                </p>
              )}
            {specError && (
              <p className='text-sm text-red-600 mt-2'>{specError}</p>
            )}
          </div>
        ) : (
          <>
            {/* Level 1 Selection */}
            <div className='md:col-span-2'>
              {specError ? (
                <div className='text-sm text-red-600'>{specError}</div>
              ) : loadingSpec ? (
                <div className='text-sm text-gray-600'>{t.loading}</div>
              ) : (
                <LevelOneCard
                  label={t.level1Label || 'Level 1'}
                  labelDescription={t.level1Description || ''}
                  placeholder={t.level1Placeholder || 'Select Level 1'}
                  options={level1Options}
                  value={level1}
                  onChange={handleLevel1Change}
                />
              )}
            </div>

            {/* Level 2 and Level 3 Selection */}
            {level1 && !specError && !loadingSpec && (
              <div className='md:col-span-2'>
                <LevelTwoCard
                  spec={audienceSpec || null}
                  level1={level1}
                  label={t.level2Label}
                  help={t.level2Help}
                  options={level2Options}
                  selectedLevel2s={level2s}
                  selectedLevel3s={level3s}
                  onToggleLevel2={handleLevel2Toggle}
                  onToggleLevel3={handleLevel3Toggle}
                  validationMessage={t.level2Validation}
                />
                <SegmentPriceFactorsCard
                  level3s={level3s}
                  segmentPriceFactors={segmentPriceFactors}
                  label={t.segmentPriceFactors}
                  notSetLabel={t.notSet}
                />
              </div>
            )}

            {/* Capacity Display */}
            <div className='md:col-span-2'>
              <CapacityCard
                title={t.campaignCapacity}
                help={t.campaignCapacityHelp}
                isLoading={false}
                capacity={capacity}
                fallbackCapacity={capacity}
                unitsLabel={t.users}
                calculatingLabel={t.calculating}
                notSetLabel={t.notSet}
                lowCapacityLabel={t.capacityTooLow}
                error={null}
              />
            </div>
          </>
        )}

        <div className='md:col-span-2 flex items-center'>
          <Button variant='outline' onClick={handleReset}>
            {t.reset}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LevelStep;
