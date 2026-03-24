import React from 'react';
import Card from '../../ui/Card';

interface SegmentPriceFactorsCardProps {
  level3s: string[];
  segmentPriceFactors: Record<string, number>;
  label: string;
  notSetLabel: string;
}

const SegmentPriceFactorsCard: React.FC<SegmentPriceFactorsCardProps> = ({
  level3s,
  segmentPriceFactors,
  label,
  notSetLabel,
}) => {
  if (level3s.length === 0) return null;

  return (
    <div className='md:col-span-2'>
      <Card padding='sm' shadow='sm'>
        <div className='space-y-1'>
          {level3s.map((l3: string) => (
            <div key={`price-factor-${l3}`} className='text-sm text-gray-700'>
              <span>
                {label}{' '}
                <span className='text-gray-900'>
                  {segmentPriceFactors[l3] ?? notSetLabel}
                </span>
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SegmentPriceFactorsCard;
