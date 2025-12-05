import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Target, Users, MapPin } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCampaign } from '../../hooks/useCampaign';
import { useToast } from '../../hooks/useToast';
import { apiService } from '../../services/api';
import StepHeader from '../ui/StepHeader';
import Card from '../ui/Card';
import FormField from '../ui/FormField';
import { CalculateCampaignCapacityRequest, AudienceSpec, AudienceSpecItem } from '../../types/campaign';
import { useAuth } from '../../hooks/useAuth';

// Module-level cache and in-flight promise to avoid duplicate audience-spec fetches (handles Strict Mode double effects)
let audienceSpecCache: AudienceSpec | null = null;
let audienceSpecFetchInFlight: Promise<AudienceSpec> | null = null;

const CampaignSegmentStep: React.FC = () => {
  const { t } = useTranslation();
  const { campaignData, updateSegment } = useCampaign();
  const { showToast } = useToast();
  const { accessToken } = useAuth();
  
  // Ensure API service has token to avoid race on hard refresh
  useEffect(() => {
    if (accessToken) {
      apiService.setAccessToken(accessToken);
    }
  }, [accessToken, showToast]);

  // Campaign capacity state
  const [capacity, setCapacity] = useState<number | undefined>(campaignData.segment.capacity);
  const [isLoadingCapacity, setIsLoadingCapacity] = useState(false);
  const [capacityError, setCapacityError] = useState<string | null>(null);
  const [hasCapacityError, setHasCapacityError] = useState(false);
  const capacityDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const capacityRequestInFlightRef = useRef(false);
  const capacityTriggeredForKeyRef = useRef<string | null>(null);
  const initialCapacityTriggeredRef = useRef(false);

  // Audience spec state
  const [audienceSpec, setAudienceSpec] = useState<AudienceSpec | null>(null);
  const [loadingSpec, setLoadingSpec] = useState(false);
  const [specError, setSpecError] = useState<string | null>(null);
  const audienceSpecFetchedRef = useRef(false);
  const hasRequestedSpecRef = useRef(false);

  // Debounced capacity calculation
  const debouncedCalculateCapacity = useCallback((data: CalculateCampaignCapacityRequest) => {
    if (hasCapacityError) return;
    if (!data.segment) return;

    if (capacityDebounceRef.current) {
      clearTimeout(capacityDebounceRef.current);
    }

    setIsLoadingCapacity(true);
    setCapacityError(null);
    if (capacityRequestInFlightRef.current) return;
    capacityRequestInFlightRef.current = true;

    capacityDebounceRef.current = setTimeout(async () => {
      try {
        const response = await apiService.calculateCampaignCapacity(data);
        if (response.success && response.data) {
          const cap = response.data.capacity;
          setCapacity(cap);
          updateSegment({ capacity: cap });
          if (cap < 500) {
            const msg = t('campaign.segment.capacityTooLow') || 'Capacity too low (< 500). Remove some filters to increase campaign capacity.';
            setCapacityError(msg);
            setHasCapacityError(true);
            updateSegment({ capacityTooLow: true });
          } else {
            setCapacityError(null);
            setHasCapacityError(false);
            updateSegment({ capacityTooLow: false });
          }
        } else {
          const errorMessage = response.message || 'Failed to calculate capacity';
          setCapacityError(errorMessage);
          setCapacity(undefined);
          setHasCapacityError(true);
          showToast('error', errorMessage);
        }
      } catch (error) {
        console.error('Error calculating capacity:', error);
        const errorMessage = 'Network error while calculating capacity';
        setCapacityError(errorMessage);
        setCapacity(undefined);
        setHasCapacityError(true);
        showToast('error', errorMessage);
      } finally {
        setIsLoadingCapacity(false);
        capacityRequestInFlightRef.current = false;
      }
    }, 800);
  }, [hasCapacityError, updateSegment, t, showToast]);

  // Helper function to trigger capacity calculation from current selections
  const triggerCapacityCalculation = useCallback((overrides?: Partial<CalculateCampaignCapacityRequest>) => {
    const effectiveSegment = overrides?.segment ?? campaignData.segment.segment;
    const effectiveSubsegments = overrides?.subsegment ?? campaignData.segment.subsegments;
    const effectiveTags = overrides?.tags ?? campaignData.segment.tags ?? [];

    if (
      hasCapacityError ||
      !effectiveSegment ||
      !effectiveSubsegments || effectiveSubsegments.length === 0 ||
      effectiveTags.length === 0
    ) {
      return;
    }

    // Build a key for the current selection to avoid duplicate calls for same selection
    const selectionKey = `${effectiveSegment}__${effectiveSubsegments.sort().join(',')}__${effectiveTags.sort().join(',')}`;
    if (capacityTriggeredForKeyRef.current === selectionKey || capacityRequestInFlightRef.current) {
      return;
    }
    capacityTriggeredForKeyRef.current = selectionKey;

    const capacityData: CalculateCampaignCapacityRequest = {
      title: campaignData.segment.campaignTitle,
      segment: effectiveSegment,
      subsegment: effectiveSubsegments,
      sex: campaignData.segment.sex,
      city: campaignData.segment.city,
      tags: effectiveTags,
      ...overrides,
    };

    debouncedCalculateCapacity(capacityData);
  }, [hasCapacityError, campaignData.segment.campaignTitle, campaignData.segment.segment, campaignData.segment.subsegments, campaignData.segment.sex, campaignData.segment.city, campaignData.segment.tags, debouncedCalculateCapacity]);

  // Reset the trigger key when selection changes
  useEffect(() => {
    capacityTriggeredForKeyRef.current = null;
  }, [campaignData.segment.segment, campaignData.segment.subsegments, campaignData.segment.tags]);

  // One-time initial trigger when preselected values exist
  useEffect(() => {
    if (initialCapacityTriggeredRef.current) return;
    const hasSegment = !!campaignData.segment.segment;
    const hasSubs = !!campaignData.segment.subsegments && campaignData.segment.subsegments.length > 0;
    const hasTags = !!campaignData.segment.tags && campaignData.segment.tags.length > 0;
    if (hasSegment && hasSubs && hasTags) {
      initialCapacityTriggeredRef.current = true;
      triggerCapacityCalculation({
        segment: campaignData.segment.segment,
        subsegment: campaignData.segment.subsegments,
        tags: campaignData.segment.tags,
      });
    }
  }, [campaignData.segment.segment, campaignData.segment.subsegments, campaignData.segment.tags, triggerCapacityCalculation]);

  // Fetch audience spec once using module-level cache/promise (handles Strict Mode)
  useEffect(() => {
    if (!accessToken) return;
    if (audienceSpecFetchedRef.current) return;

    let canceled = false;
    setLoadingSpec(true);
    setSpecError(null);

    const applySpec = (spec: AudienceSpec) => {
      if (canceled) return;
      setAudienceSpec(spec);
      setSpecError(null);
      audienceSpecFetchedRef.current = true;
      setLoadingSpec(false);
    };

    if (audienceSpecCache) {
      applySpec(audienceSpecCache);
      return () => { canceled = true; };
    }

    if (audienceSpecFetchInFlight) {
      audienceSpecFetchInFlight
        .then(spec => applySpec(spec))
        .catch(() => {
          if (canceled) return;
          const msg = 'Failed to load audience spec';
          setSpecError(msg);
          showToast('error', msg);
          setLoadingSpec(false);
        });
      return () => { canceled = true; };
    }

    if (!hasRequestedSpecRef.current) {
      hasRequestedSpecRef.current = true;
    }
    audienceSpecFetchInFlight = (async () => {
      const res = await apiService.listAudienceSpec();
      const spec = (res as any)?.data?.spec ?? (res as any)?.data?.data?.spec;
      if (!res.success || !spec) {
        throw new Error(res.message || 'Failed to load audience spec');
      }
      return spec as AudienceSpec;
    })();

    audienceSpecFetchInFlight
      .then(spec => {
        audienceSpecCache = spec;
        applySpec(spec);
      })
      .catch((e: any) => {
        if (canceled) return;
        const msg = e?.message || 'Failed to load audience spec';
        setSpecError(msg);
        showToast('error', msg);
        setLoadingSpec(false);
      })
      .finally(() => {
        audienceSpecFetchInFlight = null;
      });

    return () => { canceled = true; };
  }, [accessToken, showToast]);

  // Build level1 options from audience spec
  const segments = useMemo(() => {
    if (!audienceSpec) return [] as Array<{ value: string; label: string }>;
    return Object.keys(audienceSpec).map(seg => ({ value: seg, label: seg.replace(/_/g, ' ') }));
  }, [audienceSpec]);

  // Local search for segments
  /*
  // Local search for segments (commented out for now - using dropdown)
  const [segmentSearch, setSegmentSearch] = useState('');
  const filteredSegments = useMemo(() => {
    const q = segmentSearch.trim().toLowerCase();
    if (!q) return segments;
    return segments.filter(s => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q));
  }, [segmentSearch, segments]);

  // Build level1-level2-level3 triples for search recommendations
  const segmentSubPairs = useMemo(() => {
    if (!audienceSpec) return [] as Array<{ l1Value: string; l1Label: string; l2Value: string; l2Label: string; l3Value: string; l3Label: string }>;
    const triples: Array<{ l1Value: string; l1Label: string; l2Value: string; l2Label: string; l3Value: string; l3Label: string }> = [];
    Object.keys(audienceSpec).forEach(l1 => {
      const l1Label = l1.replace(/_/g, ' ');
      Object.keys((audienceSpec as any)[l1] || {}).forEach(l2 => {
        const l2Label = l2.replace(/_/g, ' ');
        Object.keys((audienceSpec as any)[l1][l2] || {}).forEach(l3 => {
          triples.push({ l1Value: l1, l1Label, l2Value: l2, l2Label, l3Value: l3, l3Label: l3.replace(/_/g, ' ') });
        });
      });
    });
    return triples;
  }, [audienceSpec]);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);
  */

  // Get level2 options for a given level1
  const getLevel2ForLevel1 = useCallback((l1: string): Array<{ value: string; label: string }> => {
    if (!audienceSpec || !l1 || !(audienceSpec as any)[l1]) return [];
    return Object.keys((audienceSpec as any)[l1]).map(l2 => ({ value: l2, label: l2.replace(/_/g, ' ') }));
  }, [audienceSpec]);

  // Get level3 options for a given level1 + level2
  const getLevel3ForLevel = useCallback((l1: string, l2: string): Array<{ value: string; label: string }> => {
    if (!audienceSpec || !l1 || !l2) return [];
    const bucket = (audienceSpec as any)[l1]?.[l2] || {};
    return Object.keys(bucket).map(l3 => ({ value: l3, label: l3.replace(/_/g, ' ') }));
  }, [audienceSpec]);

  // Helper: compute tags for selected path (level1, level2, level3)
  const computeTags = useCallback((level1: string, level2: string, level3: string): string[] => {
    const tagSet = new Set<string>();
    if (!audienceSpec || !level1 || !level2 || !level3) return [];
    const item = (audienceSpec as any)[level1]?.[level2]?.[level3] as AudienceSpecItem | undefined;
    if (item?.tags) item.tags.forEach(tg => tagSet.add(tg));
    return Array.from(tagSet);
  }, [audienceSpec]);

  // Local state for new levels (kept in sync with campaignData.segment.segment & subsegments for backwards compat)
  const [selectedLevel1, setSelectedLevel1] = useState<string>(campaignData.segment.segment || '');
  const [selectedLevel2, setSelectedLevel2] = useState<string>('');
  const [selectedLevel3, setSelectedLevel3] = useState<string>((campaignData.segment.subsegments && campaignData.segment.subsegments[0]) || '');

  // Keep tags in sync implicitly based on current selection
  useEffect(() => {
    if (!audienceSpec) return;
    if (!selectedLevel1 || !selectedLevel2) return;

    // If level3 is selected, use it. Otherwise if there's exactly one option in level3, use it.
    let effectiveL3 = selectedLevel3;
    const l3Options = getLevel3ForLevel(selectedLevel1, selectedLevel2);
    if (!effectiveL3 && l3Options.length === 1) {
      effectiveL3 = l3Options[0].value;
      setSelectedLevel3(effectiveL3);
    }

    if (!effectiveL3) return;

    const newTags = computeTags(selectedLevel1, selectedLevel2, effectiveL3);
    const currentTags = campaignData.segment.tags || [];
    if (newTags.length !== currentTags.length || newTags.some(t => !currentTags.includes(t))) {
      // Persist level1 as segment and level3 as subsegment for backwards compatibility
      updateSegment({ tags: newTags, segment: selectedLevel1, subsegments: [effectiveL3] });
    }
  }, [audienceSpec, selectedLevel1, selectedLevel2, selectedLevel3, getLevel3ForLevel, computeTags, campaignData.segment.tags, updateSegment]);

  const handleCampaignTitleChange = (value: string) => {
    updateSegment({ campaignTitle: value });
  };

  const handleSegmentChange = (value: string) => {
    // set local selection and clear downstream selections
    setSelectedLevel1(value);
    setSelectedLevel2('');
    setSelectedLevel3('');
    updateSegment({ 
      segment: value,
      subsegments: [],
      tags: [],
      capacity: undefined,
      capacityTooLow: false,
    });
    setCapacity(undefined);
    setHasCapacityError(false);
    setCapacityError(null);
    triggerCapacityCalculation({ segment: value, subsegment: [], tags: [] });
  };

  const handleLevel2Change = (l2: string) => {
    setSelectedLevel2(l2);
    // get level3 options under current level1+l2
    const l1 = selectedLevel1 || campaignData.segment.segment;
    const l3Options = getLevel3ForLevel(l1, l2);
    if (l3Options.length === 1) {
      const only = l3Options[0].value;
      setSelectedLevel3(only);
      const newTags = computeTags(l1, l2, only);
      updateSegment({ subsegments: [only], tags: newTags });
      triggerCapacityCalculation({ segment: l1, subsegment: [only], tags: newTags });
    } else {
      setSelectedLevel3('');
      updateSegment({ subsegments: [], tags: [] });
      triggerCapacityCalculation({ segment: l1, subsegment: [], tags: [] });
    }
  };

  const handleLevel3Change = (l3: string) => {
    setSelectedLevel3(l3);
    const l1 = selectedLevel1 || campaignData.segment.segment;
    const l2 = selectedLevel2;
    const newTags = computeTags(l1, l2, l3);
    updateSegment({ subsegments: [l3], tags: newTags });
    triggerCapacityCalculation({ segment: l1, subsegment: [l3], tags: newTags });
  };

  // Level3 change is handled inline where level3 selection is available (via search or auto-select)

  // (Sex and city filters are optional; UI currently hidden)

  return (
    <div className="space-y-8">
      <StepHeader
        title={t('campaign.segment.title')}
        subtitle={t('campaign.segment.subtitle')}
        icon={<Target className="h-6 w-6 text-primary-600" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Row 1: Campaign Title (full width) */}
        <div className="md:col-span-2">
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary-600" />
                {t('campaign.segment.campaignTitle')}
              </h3>
              <FormField
                id="campaignTitle"
                label={t('campaign.segment.campaignTitle')}
                type="text"
                placeholder={t('campaign.segment.campaignTitlePlaceholder')}
                value={campaignData.segment.campaignTitle || ''}
                onChange={handleCampaignTitleChange}
                required
                validation={{
                  max: 255,
                  message: t('campaign.segment.campaignTitleValidation')
                }}
              />
            </div>
          </Card>
        </div>

        {/* Row 2: Capacity */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                {t('campaign.segment.campaignCapacity')}
              </h3>
              <p className="text-sm text-gray-600">{t('campaign.segment.campaignCapacityHelp')}</p>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">{t('campaign.segment.estimatedCapacity')}</p>
                  <p className="text-2xl font-bold text-primary-600">{isLoadingCapacity ? t('campaign.segment.calculating') : (capacity !== undefined ? `${capacity.toLocaleString()} ${t('campaign.segment.users')}` : (campaignData.segment.capacity !== undefined ? `${campaignData.segment.capacity.toLocaleString()} ${t('campaign.segment.users')}` : t('campaign.segment.notSet')))}</p>
                  {((capacity ?? campaignData.segment.capacity) !== undefined) && (capacity ?? campaignData.segment.capacity)! < 500 && (
                    <p className="text-xs text-red-600 mt-1">{t('campaign.segment.capacityTooLow')}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {isLoadingCapacity && (
                    <svg className="animate-spin h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {capacityError && (
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L2.298 18c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  )}
                </div>
              </div>
              {capacityError && (
                <p className="text-sm text-red-600">{capacityError}</p>
              )}
            </div>
          </Card>
        </div>

        {/* Row 3: Segment and Subsegments */}
        <div className="md:col-span-2">
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary-600" />
                {t('campaign.segment.segment')}
              </h3>
              {specError ? (
                <div className="text-sm text-red-600">{specError}</div>
              ) : loadingSpec ? (
                <div className="text-sm text-gray-600">{t('common.loading')}</div>
              ) : (
                <>
                  {/*
                    Search box commented out per request. Use Level-1 dropdown instead.
                    Original search UI preserved above for re-enabling later.
                  */}

                  <FormField
                    id="segmentSelect"
                    label={t('campaign.segment.segment')}
                    type="select"
                    options={segments}
                    value={selectedLevel1 || campaignData.segment.segment || ''}
                    onChange={(v: string) => {
                      handleSegmentChange(v);
                    }}
                    placeholder={t('campaign.segment.selectSegment')}
                  />
                </>
              )}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          {campaignData.segment.segment && !specError && !loadingSpec && (
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary-600" />
                  {t('campaign.segment.subsegmentsFor', { segment: segments.find(s => s.value === campaignData.segment.segment)?.label })}
                </h3>
                <p className="text-sm text-gray-600">{t('campaign.segment.subsegmentsHelp')}</p>
                <div className="grid grid-cols-2 gap-3">
                  {getLevel2ForLevel1(selectedLevel1 || campaignData.segment.segment).map((lvl2) => (
                    <label key={lvl2.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="level2-single"
                        checked={selectedLevel2 === lvl2.value}
                        onChange={() => handleLevel2Change(lvl2.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{lvl2.label}</span>
                    </label>
                  ))}
                </div>
                {(!campaignData.segment.subsegments || campaignData.segment.subsegments.length === 0) && (
                  <p className="text-sm text-red-600">{t('campaign.segment.subsegmentsValidation')}</p>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="md:col-span-2">
          {(selectedLevel1 && selectedLevel2 && !specError && !loadingSpec && getLevel3ForLevel(selectedLevel1 || campaignData.segment.segment, selectedLevel2).length > 1) && (
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary-600" />
                  {t('campaign.segment.level3')}
                </h3>
                <p className="text-sm text-gray-600">{t('campaign.segment.level3Help')}</p>
                <div className="grid grid-cols-2 gap-3">
                  {getLevel3ForLevel(selectedLevel1 || campaignData.segment.segment, selectedLevel2).map((l3) => (
                    <label key={l3.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="level3-single"
                        checked={selectedLevel3 === l3.value}
                        onChange={() => handleLevel3Change(l3.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{l3.label}</span>
                    </label>
                  ))}
                </div>
                {campaignData.segment.subsegments && campaignData.segment.subsegments.length === 0 && (
                  <p className="text-sm text-red-600">{t('campaign.segment.subsegmentsValidation')}</p>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Optional filters: hide for now */}
        {/*
        <div className="flex flex-col">
          <Card className="h-full">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-600" />
                {t('campaign.segment.sex')}
              </h3>
              <FormField
                id="sex"
                label={t('campaign.segment.selectSex')}
                type="select"
                options={sexOptions}
                value={campaignData.segment.sex || ''}
                onChange={handleSexChange}
                placeholder={t('campaign.segment.sexPlaceholder')}
              />
            </div>
          </Card>
        </div>
        <div className="flex flex-col">
          <Card className="h-full">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Building className="h-4 w-4 mr-2 text-primary-600" />
                {t('campaign.segment.cities')}
              </h3>
              <select
                id="cities"
                value=""
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  if (!selectedValue) return;
                  const current = campaignData.segment.city || [];
                  const exists = current.includes(selectedValue);
                  const next = exists ? current : [...current, selectedValue];
                  updateSegment({ city: next });
                  triggerCapacityCalculation({ city: next });
                }}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">{t('campaign.segment.citiesPlaceholder') || 'Select a city'}</option>
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
              {campaignData.segment.city && campaignData.segment.city.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {campaignData.segment.city.map((cityValue) => {
                    const cityDef = cities.find(c => c.value === cityValue);
                    if (!cityDef) return null;
                    return (
                      <label key={cityValue} className="inline-flex items-center space-x-2 bg-gray-50 border rounded-md px-2 py-1">
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => handleCityChange(cityValue)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{cityDef.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>
        */}
      </div>
    </div>
  );
};

export default CampaignSegmentStep; 