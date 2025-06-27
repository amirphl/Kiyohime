import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Target, Users, MapPin, User, Building } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCampaign } from '../../hooks/useCampaign';
import { useToast } from '../../hooks/useToast';
import { apiService } from '../../services/api';
import StepHeader from '../ui/StepHeader';
import Card from '../ui/Card';
import FormField from '../ui/FormField';
import { CalculateCampaignCapacityRequest } from '../../types/campaign';
import { iranCitiesOrdered } from '../../data/iranCities';

const CampaignSegmentStep: React.FC = () => {
  const { t } = useTranslation();
  const { campaignData, updateSegment } = useCampaign();
  const { showToast } = useToast();
  
  // Campaign capacity state
  const [capacity, setCapacity] = useState<number | undefined>(campaignData.segment.capacity);
  const [isLoadingCapacity, setIsLoadingCapacity] = useState(false);
  const [capacityError, setCapacityError] = useState<string | null>(null);
  const [hasCapacityError, setHasCapacityError] = useState(false);
  const capacityDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced capacity calculation
  const debouncedCalculateCapacity = useCallback((data: CalculateCampaignCapacityRequest) => {
    // Don't send request if we have a capacity error
    if (hasCapacityError) return;
    if (!data.segment) return; // Don't calculate without segment

    if (capacityDebounceRef.current) {
      clearTimeout(capacityDebounceRef.current);
    }

    setIsLoadingCapacity(true);
    setCapacityError(null);

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
      }
    }, 1000); // 1 second debounce
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
  ]);

  // Helper function to trigger capacity calculation
  const triggerCapacityCalculation = useCallback((overrides?: Partial<CalculateCampaignCapacityRequest>) => {
    const capacityData: CalculateCampaignCapacityRequest = {
      title: campaignData.segment.campaignTitle,
      segment: campaignData.segment.segment,
      subsegment: campaignData.segment.subsegments,
      sex: campaignData.segment.sex,
      city: campaignData.segment.city,
      ...overrides,
    };

    if (hasCapacityError || !capacityData.segment) return;
    debouncedCalculateCapacity(capacityData);
  }, [hasCapacityError, campaignData.segment.campaignTitle, campaignData.segment.segment, campaignData.segment.subsegments, campaignData.segment.sex, campaignData.segment.city, debouncedCalculateCapacity]);

  // Test data for segments with their specific subsegments
  const segmentsWithSubsegments = {
    new_customers: {
      label: 'New Customers',
      subsegments: [
        { value: 'first_time_buyers', label: 'First Time Buyers' },
        { value: 'recent_signups', label: 'Recent Signups' },
        { value: 'trial_users', label: 'Trial Users' },
        { value: 'onboarding', label: 'Onboarding' },
      ]
    },
    existing_customers: {
      label: 'Existing Customers',
      subsegments: [
        { value: 'active_users', label: 'Active Users' },
        { value: 'regular_buyers', label: 'Regular Buyers' },
        { value: 'returning_customers', label: 'Returning Customers' },
        { value: 'engaged_users', label: 'Engaged Users' },
      ]
    },
    vip_customers: {
      label: 'VIP Customers',
      subsegments: [
        { value: 'high_value', label: 'High Value' },
        { value: 'premium_tier', label: 'Premium Tier' },
        { value: 'exclusive_members', label: 'Exclusive Members' },
        { value: 'whale_customers', label: 'Whale Customers' },
      ]
    },
    inactive_customers: {
      label: 'Inactive Customers',
      subsegments: [
        { value: 'dormant_users', label: 'Dormant Users' },
        { value: 'churned_customers', label: 'Churned Customers' },
        { value: 'low_engagement', label: 'Low Engagement' },
        { value: 'at_risk', label: 'At Risk' },
      ]
    },
    loyal_customers: {
      label: 'Loyal Customers',
      subsegments: [
        { value: 'long_term', label: 'Long Term' },
        { value: 'brand_advocates', label: 'Brand Advocates' },
        { value: 'referral_sources', label: 'Referral Sources' },
        { value: 'community_members', label: 'Community Members' },
      ]
    },
    premium_customers: {
      label: 'Premium Customers',
      subsegments: [
        { value: 'subscription_holders', label: 'Subscription Holders' },
        { value: 'enterprise_clients', label: 'Enterprise Clients' },
        { value: 'high_spenders', label: 'High Spenders' },
        { value: 'feature_users', label: 'Feature Users' },
      ]
    },
  };

  // Get available segments for dropdown
  const segments = Object.entries(segmentsWithSubsegments).map(([value, data]) => ({
    value,
    label: data.label
  }));

  // Get subsegments based on selected segment
  const getSubsegmentsForSegment = (segmentValue: string) => {
    return segmentsWithSubsegments[segmentValue as keyof typeof segmentsWithSubsegments]?.subsegments || [];
  };

  // Sex options
  const sexOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'all', label: 'All' },
  ];

  // Cities ordered by population (top ~200) - ensure unique values to avoid duplicate React keys
  const cities = useMemo(() => {
    const seen = new Set<string>();
    return iranCitiesOrdered.filter(c => {
      if (seen.has(c.value)) return false;
      seen.add(c.value);
      return true;
    });
  }, []);

  const handleCampaignTitleChange = (value: string) => {
    updateSegment({ campaignTitle: value });
  };

  const handleSegmentChange = (value: string) => {
    // Clear subsegments when segment changes
    updateSegment({ 
      segment: value,
      subsegments: []
    });
    triggerCapacityCalculation({ segment: value, subsegment: [] });
  };

  const handleSubsegmentsChange = (value: string) => {
    const currentSubsegments = campaignData.segment.subsegments || [];
    let newSubsegments: string[];
    
    if (currentSubsegments.includes(value)) {
      // Remove if already selected
      newSubsegments = currentSubsegments.filter(sub => sub !== value);
    } else {
      // Add if not selected
      newSubsegments = [...currentSubsegments, value];
    }
    
    updateSegment({ subsegments: newSubsegments });
    triggerCapacityCalculation({ subsegment: newSubsegments });
  };

  const handleSexChange = (value: string) => {
    updateSegment({ sex: value });
    triggerCapacityCalculation({ sex: value });
  };

  const handleCityChange = (value: string) => {
    const currentCities = campaignData.segment.city || [];
    let newCities: string[];
    
    if (currentCities.includes(value)) {
      // Remove if already selected
      newCities = currentCities.filter(city => city !== value);
    } else {
      // Add if not selected
      newCities = [...currentCities, value];
    }
    
    updateSegment({ city: newCities });
    triggerCapacityCalculation({ city: newCities });
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

        {/* Row 2: Sex (left) and Capacity (right) */}
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
                required
                placeholder={t('campaign.segment.sexPlaceholder')}
        />
      </div>
          </Card>
        </div>
        <div className="flex flex-col">
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

        {/* Row 3: Segment (left, includes Cities) and Subsegments (right) */}
        <div>
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary-600" />
                {t('campaign.segment.segment')}
              </h3>
              <FormField
                id="segment"
                label={t('campaign.segment.selectSegment')}
                type="select"
                options={segments}
                value={campaignData.segment.segment || ''}
                onChange={handleSegmentChange}
                required
                placeholder={t('campaign.segment.segmentPlaceholder')}
              />

              {/* Cities inside Segment card for compact layout */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <Building className="h-4 w-4 mr-2 text-primary-600" />
                  {t('campaign.segment.cities')}
                </h4>
                <p className="text-sm text-gray-600">{t('campaign.segment.citiesHelp')}</p>
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
                {campaignData.segment.city && campaignData.segment.city.length === 0 && (
                  <p className="text-sm text-red-600">{t('campaign.segment.citiesValidation')}</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div>
          {campaignData.segment.segment && (
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
      </div>
    </div>
  );
};

export default CampaignSegmentStep; 