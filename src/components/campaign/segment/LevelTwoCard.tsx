import React, { useEffect } from 'react';
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

  // Auto-select Level 3 when there is only one option for a chosen Level 2
  useEffect(() => {
    if (!spec || !level1 || selectedLevel2s.length === 0) return;
    selectedLevel2s.forEach(l2 => {
      const l3Options = getLevel3Options(spec, level1, l2);
      if (l3Options.length === 1) {
        const onlyL3 = l3Options[0].value;
        if (!selectedLevel3s.includes(onlyL3)) {
          onToggleLevel3(onlyL3);
        }
      }
    });
  }, [spec, level1, selectedLevel2s, selectedLevel3s, onToggleLevel3]);

  return (
    <Card>
      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900'>{label}</h3>
        <p className='text-sm text-gray-600'>{help}</p>
        <div className='grid grid-cols-2 gap-3'>
          {options.map(lvl2 => (
            <div key={lvl2.value} className='flex items-center space-x-3'>
              <label className='flex items-center space-x-3 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={selectedLevel2s.includes(lvl2.value)}
                  onChange={() => onToggleLevel2(lvl2.value)}
                  className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300'
                />
                <span className='text-sm text-gray-700'>{lvl2.label}</span>
              </label>
              <div className='relative group'>
                <span className='inline-flex items-center justify-center w-5 h-5 rounded-full border text-xs border-primary-600 text-primary-600 select-none'>
                  {t('campaign.level.questionMark') || '?'}
                </span>
                {(() => {
                  const meta = getLevel2Metadata(spec, level1, lvl2.value);
                  if (!meta || Object.keys(meta).length === 0) return null;
                  return (
                    <div className='absolute z-10 hidden group-hover:block bg-gray-900 text-white text-xs rounded-md shadow-lg p-3 w-80 -left-1/2 top-6'>
                      <div className='font-medium mb-1'>
                        {formatLabel(lvl2.value)}
                      </div>
                      <div className='space-y-1'>
                        {Object.entries(meta).map(([k, v]) => (
                          <div
                            key={t(`campaign.level.${k}`)}
                            className='flex flex-col text-ellipsis overflow-hidden'
                          >
                            <span className='mr-2 text-gray-300'>
                              {t(`campaign.level.${k}`)}
                            </span>
                            <span className='text-gray-100 text-left'>
                              {typeof v === 'object'
                                ? JSON.stringify(v)
                                : String(v)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>

        {selectedLevel2s.length > 0 && (
          <div className='space-y-4'>
            {selectedLevel2s.map(l2 => {
              const l3Options = getLevel3Options(spec, level1, l2);
              const showLevel3Choices = l3Options.length > 1;
              return (
                <div key={`meta-${l2}`}>
                  {showLevel3Choices && (
                    <div className='space-y-2 border-t pt-4'>
                      <h4 className='text-sm font-medium text-gray-800'>
                        {t('campaign.level.level3')} - {formatLabel(l2)}
                      </h4>
                      <div className='grid grid-cols-2 gap-3'>
                        {l3Options.map(l3 => (
                          <label
                            key={`${l2}-${l3.value}`}
                            className='flex items-center space-x-3 cursor-pointer'
                          >
                            <input
                              type='checkbox'
                              checked={selectedLevel3s.includes(l3.value)}
                              onChange={() => onToggleLevel3(l3.value)}
                              className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300'
                            />
                            <span className='text-sm text-gray-700'>
                              {l3.label}
                            </span>
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
