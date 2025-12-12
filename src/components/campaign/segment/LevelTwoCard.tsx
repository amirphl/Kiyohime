import React from 'react';
import Card from '../../ui/Card';
import { getLevel2Metadata, getLevel3Options, formatLabel } from './utils';
import { AudienceSpec } from '../../../types/campaign';
import { useTranslation } from '../../../hooks/useTranslation';

interface LevelTwoCardProps {
    spec: AudienceSpec | null;
    level1: string;
    label: string;
    help: string;
    options: Array<{ value: string; label: string }>;
    selectedLevel2s: string[];
    selectedLevel3s: string[];
    onToggleLevel2: (l2: string) => void;
    onToggleLevel3: (l3: string) => void;
    validationMessage: string;
}

const LevelTwoCard: React.FC<LevelTwoCardProps> = ({
    spec,
    level1,
    label,
    help,
    options,
    selectedLevel2s,
    selectedLevel3s,
    onToggleLevel2,
    onToggleLevel3,
    validationMessage,
}) => {
    const { t } = useTranslation();
    return (
        <Card>
            <div className='space-y-4'>
                <h3 className='text-lg font-medium text-gray-900'>{label}</h3>
                <p className='text-sm text-gray-600'>{help}</p>
                <div className='grid grid-cols-2 gap-3'>
                    {options.map(lvl2 => (
                        <label key={lvl2.value} className='flex items-center space-x-3 cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={selectedLevel2s.includes(lvl2.value)}
                                onChange={() => onToggleLevel2(lvl2.value)}
                                className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300'
                            />
                            <span className='text-sm text-gray-700'>{lvl2.label}</span>
                        </label>
                    ))}
                </div>

                {selectedLevel2s.length > 0 && (
                    <div className='space-y-4'>
                        {selectedLevel2s.map(l2 => {
                            const meta = getLevel2Metadata(spec, level1, l2);
                            const l3Options = getLevel3Options(spec, level1, l2);
                            return (
                                <div key={`meta-${l2}`} className='border-t pt-4'>
                                    {meta && (
                                        <div className='bg-gray-50 rounded-md p-3 mb-3'>
                                            <h4 className='text-sm font-medium text-gray-800 mb-2'>
                                                {formatLabel(l2)}
                                            </h4>
                                            <div className='grid grid-cols-2 gap-2'>
                                                {Object.entries(meta).map(([k, v]) => (
                                                    <div key={k} className='text-xs text-gray-700'>
                                                        <span className='font-medium'>{t(`campaign.level.${k}`)}: </span>
                                                        <span>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {l3Options.length > 0 && (
                                        <div className='space-y-2'>
                                            <h4 className='text-sm font-medium text-gray-800'>
                                                {t('campaign.level.level3')} - {formatLabel(l2)}
                                                {l3Options.length === 1 && (
                                                    <span className='text-xs text-gray-500 ml-2'>(auto-selected)</span>
                                                )}
                                            </h4>
                                            <div className='grid grid-cols-2 gap-3'>
                                                {l3Options.map(l3 => (
                                                    <label key={`${l2}-${l3.value}`} className='flex items-center space-x-3 cursor-pointer'>
                                                        <input
                                                            type='checkbox'
                                                            checked={selectedLevel3s.includes(l3.value)}
                                                            onChange={() => onToggleLevel3(l3.value)}
                                                            className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300'
                                                        />
                                                        <span className='text-sm text-gray-700'>{l3.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {selectedLevel2s.length === 0 && (
                    <p className='text-sm text-red-600'>{validationMessage}</p>
                )}
            </div>
        </Card>
    );
};

export default LevelTwoCard; 