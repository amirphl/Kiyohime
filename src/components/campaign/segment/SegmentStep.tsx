import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { useCampaign } from '../../../hooks/useCampaign';
import { apiService } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';
import TitleCard from './TitleCard';
import CapacityCard from './CapacityCard';
import LevelOneCard from './LevelOneCard';
import LevelTwoCard from './LevelTwoCard';
import { useAudienceSpec } from './useAudienceSpec';
import { getLevel1Options, getLevel2Options, getLevel3Options, getItemTags, getLevel2Metadata } from './utils';
import {
    LevelSelectionState,
    saveLevelSelection,
    loadLevelSelection,
    createEmptyLevelSelection
} from '../../../types/segment';

const LevelStep: React.FC = () => {
    const { t } = useTranslation();
    const { updateLevel } = useCampaign();
    const { accessToken } = useAuth();

    // Local state for selections
    const [campaignTitle, setCampaignTitle] = useState<string>('');
    const [level1, setLevel1] = useState<string>('');
    const [level2s, setLevel2s] = useState<string[]>([]);
    const [level3s, setLevel3s] = useState<string[]>([]);
    const [capacity, setCapacity] = useState<number>(0);

    // Track if initialization has already happened
    const initializedRef = useRef(false);

    // Fetch audience spec on mount
    const { spec: audienceSpec, loading: loadingSpec, error: specError } = useAudienceSpec();

    // Ensure API service has token
    useEffect(() => {
        if (accessToken) {
            apiService.setAccessToken(accessToken);
        }
    }, [accessToken]);

    // Initialize from localStorage when spec is loaded (only once)
    // Loads from dedicated level selection storage, with fallback to campaignData
    useEffect(() => {
        if (!audienceSpec || initializedRef.current) return;

        // Try to load from dedicated level selection storage first
        const savedSelection = loadLevelSelection();

        if (savedSelection) {
            // Always restore campaignTitle if it exists
            if (savedSelection.campaignTitle) {
                setCampaignTitle(savedSelection.campaignTitle);
                updateLevel({ campaignTitle: savedSelection.campaignTitle });
            }

            // Restore level selections if they exist
            if (savedSelection.level1s.length > 0 && savedSelection.level3s.length > 0) {
                setLevel1(savedSelection.level1s[0]);
                setLevel2s(savedSelection.level2s);
                setLevel3s(savedSelection.level3s);
                setCapacity(savedSelection.count);
            }
        }

        // Mark as initialized
        initializedRef.current = true;
    }, [audienceSpec, updateLevel]);

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
        if (l3Array.length !== level3s.length || !l3Array.every(l3 => level3s.includes(l3))) {
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

            const l3Options = getLevel3Options(audienceSpec, level1, l2).map(opt => opt.value);
            const selectedForL3 = l3Array.filter(l3 => l3Options.includes(l3));

            selectedForL3.forEach(l3 => {
                const item = (audienceSpec as any)?.[level1]?.[l2]?.items?.[l3];
                const count = typeof item?.available_audience === 'number' ? item.available_audience : 0;
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
            level1: level1,        // Level 1 selection
            level2s: level2s,      // Level 2 selections
            level3s: l3Array,      // Level 3 selections
            tags: Array.from(tags), // Union of tags from selected level3s
            capacity: totalCapacity,
            capacityTooLow: capacityTooLow,
        });
    }, [audienceSpec, level1, level2s, level3s, campaignTitle, updateLevel]);

    const handleCampaignTitleChange = (value: string) => {
        setCampaignTitle(value);
        updateLevel({ campaignTitle: value });
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
                const l3ToRemove = getLevel3Options(audienceSpec || null, level1, l2).map(opt => opt.value);
                setLevel3s(prevL3s => prevL3s.filter(l3 => !l3ToRemove.includes(l3)));
                return prev.filter(item => item !== l2);
            } else {
                return [...prev, l2];
            }
        });
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

    const level1Options = getLevel1Options(audienceSpec || null);
    const level2Options = getLevel2Options(audienceSpec || null, level1);

    return (
        <div className='space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch'>
                {/* Campaign Title */}
                <div className='md:col-span-2'>
                    <TitleCard
                        title={campaignTitle || ''}
                        onChange={handleCampaignTitleChange}
                        label={t('campaign.level.campaignTitle')}
                        placeholder={t('campaign.level.campaignTitlePlaceholder')}
                        validationMessage={t('campaign.level.campaignTitleValidation')}
                    />
                </div>

                {/* Capacity Display */}
                <div className='md:col-span-2'>
                    <CapacityCard
                        title={t('campaign.level.campaignCapacity')}
                        help={t('campaign.level.campaignCapacityHelp')}
                        isLoading={false}
                        capacity={capacity}
                        fallbackCapacity={capacity}
                        unitsLabel={t('campaign.level.users')}
                        calculatingLabel={t('campaign.level.calculating')}
                        notSetLabel={t('campaign.level.notSet')}
                        lowCapacityLabel={t('campaign.level.capacityTooLow')}
                        error={null}
                    />
                </div>

                {/* Level 1 Selection */}
                <div className='md:col-span-2'>
                    {specError ? (
                        <div className='text-sm text-red-600'>{specError}</div>
                    ) : loadingSpec ? (
                        <div className='text-sm text-gray-600'>{t('common.loading')}</div>
                    ) : (
                        <LevelOneCard
                            label={t('campaign.level.level1Label') || 'Level 1'}
                            placeholder={t('campaign.level.level1Placeholder') || 'Select Level 1'}
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
                            label={t('campaign.level.level2Label') || 'Level 2'}
                            help={t('campaign.level.level2Help') || 'Choose one or more Level 2 groups'}
                            options={level2Options}
                            selectedLevel2s={level2s}
                            selectedLevel3s={level3s}
                            onToggleLevel2={handleLevel2Toggle}
                            onToggleLevel3={handleLevel3Toggle}
                            validationMessage={t('campaign.level.level2Validation')}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LevelStep; 