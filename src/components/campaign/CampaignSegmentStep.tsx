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
import { iranCitiesOrdered } from '../../data/iranCities';
import { useAuth } from '../../hooks/useAuth';

// Module-level cache and in-flight promise to avoid duplicate audience-spec fetches (handles Strict Mode double effects)
let audienceSpecCache: AudienceSpec | null = null;
let audienceSpecFetchInFlight: Promise<AudienceSpec> | null = null;

const CampaignSegmentStep: React.FC = () => {
  const { t } = useTranslation();
  const { campaignData, updateSegment } = useCampaign();
  const { showToast } = useToast();
  const { isAuthenticated, accessToken } = useAuth();
  
  // Ensure API service has token to avoid race on hard refresh
  useEffect(() => {
    if (accessToken) {
      apiService.setAccessToken(accessToken);
    }
  }, [accessToken]);

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
  }, [showToast, hasCapacityError, t, updateSegment]);

  // Reset capacity error when user makes changes
  useEffect(() => {
    if (hasCapacityError) {
      setHasCapacityError(false);
      setCapacityError(null);
    }
  }, [
    hasCapacityError,
    campaignData.segment.campaignTitle,
    campaignData.segment.segment,
    campaignData.segment.subsegments,
    campaignData.segment.sex,
    campaignData.segment.city,
    campaignData.segment.tags,
  ]);

  // Helper: compute all tags for current segment + subsegments
  const computeTags = useCallback((segmentValue: string, subsegments: string[]): string[] => {
    const tagSet = new Set<string>();
    if (!audienceSpec || !segmentValue || !subsegments?.length) return [];
    subsegments.forEach(s => {
      const item = audienceSpec[segmentValue]?.[s];
      if (item?.tags) item.tags.forEach(tg => tagSet.add(tg));
    });
    return Array.from(tagSet);
  }, [audienceSpec]);

  // Helper function to trigger capacity calculation
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

  // Build segments and subsegments from audience spec
  const segments = useMemo(() => {
    if (!audienceSpec) return [] as Array<{ value: string; label: string }>;
    return Object.keys(audienceSpec).map(seg => ({ value: seg, label: seg.replace(/_/g, ' ') }));
  }, [audienceSpec]);

  // Local search for segments
  const [segmentSearch, setSegmentSearch] = useState('');
  const filteredSegments = useMemo(() => {
    const q = segmentSearch.trim().toLowerCase();
    if (!q) return segments;
    return segments.filter(s => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q));
  }, [segmentSearch, segments]);

  // Build segment-subsegment pairs for search recommendations
  const segmentSubPairs = useMemo(() => {
    if (!audienceSpec) return [] as Array<{ segValue: string; segLabel: string; subValue: string; subLabel: string }>;
    const pairs: Array<{ segValue: string; segLabel: string; subValue: string; subLabel: string }> = [];
    Object.keys(audienceSpec).forEach(seg => {
      const segLabel = seg.replace(/_/g, ' ');
      Object.keys(audienceSpec[seg] || {}).forEach(sub => {
        pairs.push({ segValue: seg, segLabel, subValue: sub, subLabel: sub.replace(/_/g, ' ') });
      });
    });
    return pairs;
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

  const getSubsegmentsForSegment = useCallback((segmentValue: string): Array<{ value: string; label: string; item?: AudienceSpecItem }> => {
    if (!audienceSpec || !segmentValue || !audienceSpec[segmentValue]) return [];
    return Object.entries(audienceSpec[segmentValue]).map(([sub, item]) => ({ value: sub, label: sub.replace(/_/g, ' '), item }));
  }, [audienceSpec]);

  // Keep tags in sync implicitly based on current selection
  useEffect(() => {
    if (!audienceSpec) return;
    if (!campaignData.segment.segment) return;
    const subs = campaignData.segment.subsegments || [];
    const newTags = computeTags(campaignData.segment.segment, subs);
    const currentTags = campaignData.segment.tags || [];
    if (newTags.length !== currentTags.length || newTags.some(t => !currentTags.includes(t))) {
      updateSegment({ tags: newTags });
    }
  }, [audienceSpec, campaignData.segment.segment, campaignData.segment.subsegments, computeTags, updateSegment]);

  const handleCampaignTitleChange = (value: string) => {
    updateSegment({ campaignTitle: value });
  };

  const handleSegmentChange = (value: string) => {
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

  const handleSubsegmentsChange = (value: string) => {
    const currentSubsegments = campaignData.segment.subsegments || [];
    let newSubsegments: string[];
    
    if (currentSubsegments.includes(value)) {
      newSubsegments = currentSubsegments.filter(sub => sub !== value);
    } else {
      newSubsegments = [...currentSubsegments, value];
    }
    const newTags = computeTags(campaignData.segment.segment, newSubsegments);
    updateSegment({ subsegments: newSubsegments, tags: newTags });
    if (!newSubsegments.length || !newTags.length) {
      setCapacity(undefined);
      setHasCapacityError(false);
      setCapacityError(null);
      updateSegment({ capacity: undefined, capacityTooLow: false });
    }
    triggerCapacityCalculation({ subsegment: newSubsegments, tags: newTags });
  };

  // Sex and City now optional: keep handlers but do not require in UI
  const sexOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'all', label: 'All' },
  ];

  const cities = useMemo(() => {
    const seen = new Set<string>();
    return iranCitiesOrdered.filter(c => {
      if (seen.has(c.value)) return false;
      seen.add(c.value);
      return true;
    });
  }, []);

  const handleSexChange = (value: string) => {
    updateSegment({ sex: value });
  };

  const handleCityChange = (value: string) => {
    const currentCities = campaignData.segment.city || [];
    let newCities: string[];
    
    if (currentCities.includes(value)) {
      newCities = currentCities.filter(city => city !== value);
    } else {
      newCities = [...currentCities, value];
    }
    updateSegment({ city: newCities });
  };

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
        <div>
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
                  <div className="mb-2 relative" ref={searchBoxRef}>
                    <input
                      id="segmentSearch"
                      type="text"
                      value={segmentSearch}
                      onChange={(e) => setSegmentSearch(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      placeholder={t('campaign.segment.searchPlaceholder') || 'Search segments or subsegments...'}
                      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-gray-300"
                    />
                    {(isSearchFocused && (segmentSearch.trim().length === 0 || segmentSearch.trim().length >= 3)) && (
                      <div className="absolute z-10 mt-1 w-full max-h-64 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
                        {segmentSearch.trim().length === 0 ? (
                          // Recommend only segments when empty
                          filteredSegments.length > 0 ? (
                            filteredSegments.map(seg => (
                              <button
                                key={seg.value}
                                type="button"
                                className="w-full text-left px-3 py-2 hover:bg-gray-50"
                                onMouseDown={() => {
                                  setSegmentSearch(seg.label);
                                  setIsSearchFocused(false);
                                  handleSegmentChange(seg.value);
                                }}
                              >
                                {seg.label}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">{t('common.noResults') || 'No results'}</div>
                          )
                        ) : (
                          // Recommend segment - subsegment pairs when query length >= 3
                          (() => {
                            const q = segmentSearch.trim().toLowerCase();
                            const matches = segmentSubPairs.filter(p =>
                              p.segLabel.toLowerCase().includes(q) || p.subLabel.toLowerCase().includes(q)
                            );
                            return matches.length > 0 ? (
                              matches.map(p => (
                                <button
                                  key={`${p.segValue}__${p.subValue}`}
                                  type="button"
                                  className="w-full text-left px-3 py-2 hover:bg-gray-50"
                                  onMouseDown={() => {
                                    setSegmentSearch(`${p.segLabel} - ${p.subLabel}`);
                                    setIsSearchFocused(false);
                                    // Apply selection: set segment and ensure subsegment is checked
                                    if (campaignData.segment.segment !== p.segValue) {
                                      const newTags = computeTags(p.segValue, [p.subValue]);
                                      updateSegment({ segment: p.segValue, subsegments: [p.subValue], tags: newTags, capacity: undefined, capacityTooLow: false });
                                      setCapacity(undefined);
                                      setHasCapacityError(false);
                                      setCapacityError(null);
                                      triggerCapacityCalculation({ segment: p.segValue, subsegment: [p.subValue], tags: newTags });
                                    } else {
                                      const currentSubs = campaignData.segment.subsegments || [];
                                      const mergedSubs = currentSubs.includes(p.subValue) ? currentSubs : [...currentSubs, p.subValue];
                                      const newTags = computeTags(p.segValue, mergedSubs);
                                      updateSegment({ subsegments: mergedSubs, tags: newTags });
                                      triggerCapacityCalculation({ subsegment: mergedSubs, tags: newTags });
                                    }
                                  }}
                                >
                                  {p.segLabel} - {p.subLabel}
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-sm text-gray-500">{t('common.noResults') || 'No results'}</div>
                            );
                          })()
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        <div>
          {campaignData.segment.segment && !specError && !loadingSpec && (
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary-600" />
                  {t('campaign.segment.subsegmentsFor', { segment: segments.find(s => s.value === campaignData.segment.segment)?.label })}
                </h3>
                <p className="text-sm text-gray-600">{t('campaign.segment.subsegmentsHelp')}</p>
                <div className="grid grid-cols-2 gap-3">
                  {getSubsegmentsForSegment(campaignData.segment.segment).map((subsegment) => (
                    <label key={subsegment.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={campaignData.segment.subsegments?.includes(subsegment.value) || false}
                        onChange={() => handleSubsegmentsChange(subsegment.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{subsegment.label}</span>
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