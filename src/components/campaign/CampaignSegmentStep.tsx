import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../hooks/useLanguage';
import { useCampaign } from '../../hooks/useCampaign';

const CampaignSegmentStep: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { campaignData, updateSegment } = useCampaign();

  const [newFilter, setNewFilter] = useState({
    field: '',
    operator: 'equals',
    value: '',
  });

  const customerTypes = [
    'new_customers',
    'existing_customers',
    'vip_customers',
    'inactive_customers',
  ];

  const ageRanges = [
    '18-24',
    '25-34',
    '35-44',
    '45-54',
    '55-64',
    '65+',
  ];

  const interests = [
    'technology',
    'fashion',
    'sports',
    'food',
    'travel',
    'health',
    'education',
    'entertainment',
  ];

  const filterFields = [
    'purchase_history',
    'last_activity',
    'total_spent',
    'location',
    'gender',
    'occupation',
  ];

  const filterOperators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'in_range', label: 'In Range' },
  ];

  const handleCustomerTypeChange = (value: string) => {
    updateSegment({ customerType: value });
  };

  const handleAgeRangeChange = (value: string) => {
    updateSegment({ ageRange: value });
  };

  const handleLocationChange = (value: string) => {
    updateSegment({ location: value });
  };

  const handleInterestToggle = (interest: string) => {
    const currentInterests = campaignData.segment.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    
    updateSegment({ interests: newInterests });
  };

  const handleAddFilter = () => {
    if (newFilter.field && newFilter.value) {
      const currentFilters = [...campaignData.segment.customFilters, newFilter];
      updateSegment({ customFilters: currentFilters });
      setNewFilter({ field: '', operator: 'equals', value: '' });
    }
  };

  const handleRemoveFilter = (index: number) => {
    const currentFilters = campaignData.segment.customFilters.filter((_, i) => i !== index);
    updateSegment({ customFilters: currentFilters });
  };

  const handleFilterChange = (field: keyof typeof newFilter, value: string) => {
    setNewFilter(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('campaign.segment.title')}
        </h2>
        <p className="text-gray-600">
          {t('campaign.segment.subtitle')}
        </p>
      </div>

      {/* Customer Type */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          {t('campaign.segment.customerType')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {customerTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleCustomerTypeChange(type)}
              className={`p-3 text-left rounded-lg border-2 transition-colors ${
                campaignData.segment.customerType === type
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="capitalize">{type.replace('_', ' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Age Range */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          {t('campaign.segment.ageRange')}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {ageRanges.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => handleAgeRangeChange(range)}
              className={`p-3 text-center rounded-lg border-2 transition-colors ${
                campaignData.segment.ageRange === range
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          {t('campaign.segment.location')}
        </label>
        <input
          type="text"
          id="location"
          value={campaignData.segment.location || ''}
          onChange={(e) => handleLocationChange(e.target.value)}
          placeholder={t('campaign.segment.locationPlaceholder')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Interests */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          {t('campaign.segment.interests')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {interests.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => handleInterestToggle(interest)}
              className={`p-3 text-left rounded-lg border-2 transition-colors ${
                campaignData.segment.interests?.includes(interest)
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="capitalize">{interest}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Filters */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          {t('campaign.segment.customFilters')}
        </label>
        
        {/* Existing Filters */}
        {campaignData.segment.customFilters.length > 0 && (
          <div className="space-y-3">
            {campaignData.segment.customFilters.map((filter, index) => (
              <div
                key={index}
                className={`flex items-center p-3 bg-gray-50 rounded-lg ${
                  isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'
                }`}
              >
                <span className="text-sm font-medium text-gray-700 min-w-0 flex-1">
                  {filter.field} {filter.operator} {filter.value}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveFilter(index)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Filter */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className={`grid grid-cols-3 gap-3 mb-3 ${
            isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'
          }`}>
            <select
              value={newFilter.field}
              onChange={(e) => handleFilterChange('field', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">{t('campaign.segment.filterField')}</option>
              {filterFields.map((field) => (
                <option key={field} value={field}>
                  {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>

            <select
              value={newFilter.operator}
              onChange={(e) => handleFilterChange('operator', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {filterOperators.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={newFilter.value}
              onChange={(e) => handleFilterChange('value', e.target.value)}
              placeholder={t('campaign.segment.filterValue')}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <button
            type="button"
            onClick={handleAddFilter}
            disabled={!newFilter.field || !newFilter.value}
            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
            }`}
          >
            <Plus className="h-4 w-4" />
            {t('campaign.segment.addFilter')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignSegmentStep; 